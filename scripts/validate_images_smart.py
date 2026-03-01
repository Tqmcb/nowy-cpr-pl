#!/usr/bin/env python3
"""
Walidacja zdjęć blogowych — wersja SMART.
Sprawdza tylko unikalne zdjęcia, każde dla WSZYSTKICH artykułów które go używają.
Gemini 2.5 Flash Vision, 12s przerwy między requestami (bezpieczny free tier).
"""

import os, re, json, time, base64, sys
import urllib.request, urllib.error
from pathlib import Path
from collections import defaultdict

PROJECT_ROOT = Path("/Users/admin/Downloads/nowy-cpr-pl")
CONTENT_DIR  = PROJECT_ROOT / "content" / "blog"
IMAGES_DIR   = PROJECT_ROOT / "public" / "images" / "blog"
ENV_FILE     = PROJECT_ROOT / ".env"
OUT_FILE     = PROJECT_ROOT / "scripts" / "validation_results.json"

GEMINI_MODEL    = "gemini-2.5-flash"
DELAY_BETWEEN   = 12   # sekund między requestami
RETRY_DELAY     = 45   # sekund przy 429

def load_key():
    for line in ENV_FILE.read_text().splitlines():
        if line.startswith("GEMINI_API_KEY="):
            return line.split("=", 1)[1].strip()
    return ""

def parse_fm(p):
    text = p.read_text(encoding="utf-8")
    m = re.match(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
    if not m: return {}
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip('"')
    return meta

def gemini_validate(key, img_b64, articles):
    """Ocenia jedno zdjęcie dla listy artykułów które go używają."""
    articles_text = "\n".join(
        f"- {a['title']} (tagi: {a['tags']})"
        for a in articles[:5]
    )
    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"{GEMINI_MODEL}:generateContent?key={key}")
    prompt = f"""Jesteś ekspertem od bloga o przepisach budowlanych UE (CPR).

To zdjęcie jest używane jako ilustracja do tych artykułów:
{articles_text}

Oceń 1-10 jak DOBRZE to zdjęcie pasuje do tych tematów (1=zupełnie nie, 10=idealnie).

Odpowiedz TYLKO JSON (bez markdown):
{{"score": N, "reason": "<uzasadnienie PL, max 120 znaków>", "pexels_query": "<english search query for better photo, ONLY if score<6>"}}"""

    data = json.dumps({
        "contents": [{"parts": [
            {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}},
            {"text": prompt}
        ]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 200}
    }).encode()

    req = urllib.request.Request(url, data=data,
                                 headers={"Content-Type": "application/json"})
    for attempt in range(4):
        try:
            r = json.load(urllib.request.urlopen(req, timeout=40))
            raw = r["candidates"][0]["content"]["parts"][0]["text"].strip()
            raw = re.sub(r"```json\s*|```\s*", "", raw).strip()
            return json.loads(raw)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = RETRY_DELAY * (attempt + 1)
                print(f"    ⏳ 429 rate limit — czekam {wait}s (próba {attempt+1}/4)...",
                      flush=True)
                time.sleep(wait)
            else:
                body = e.read().decode()[:300]
                raise RuntimeError(f"HTTP {e.code}: {body}")
        except json.JSONDecodeError:
            raise RuntimeError(f"Zły JSON: {raw[:200]}")
    raise RuntimeError("Rate limit — wyczerpano wszystkie próby")

def main():
    key = load_key()
    if not key or len(key) < 20:
        print("❌ Brak GEMINI_API_KEY w .env"); sys.exit(1)

    # Zbierz posty i pogrupuj po zdjęciu
    image_articles = defaultdict(list)  # img_filename → [artykuły]
    all_posts = []

    for md in sorted(CONTENT_DIR.glob("*.md")):
        meta = parse_fm(md)
        if not meta.get("title"): continue
        img_rel = meta.get("image_url", "").lstrip("/")
        img_path = PROJECT_ROOT / "public" / img_rel
        post = {
            "file": md.name,
            "title": meta.get("title", ""),
            "tags": meta.get("tags", ""),
            "excerpt": meta.get("excerpt", ""),
            "image_file": img_path.name,
            "image_path": img_path,
        }
        all_posts.append(post)
        image_articles[img_path.name].append(post)

    unique_images = [(img, posts) for img, posts in image_articles.items()
                     if (IMAGES_DIR / img).exists()]
    unique_images.sort(key=lambda x: x[0])

    print(f"📋 {len(all_posts)} artykułów, {len(unique_images)} unikalnych zdjęć\n",
          flush=True)

    # Waliduj każde unikalne zdjęcie
    image_results = {}
    for i, (img_file, articles) in enumerate(unique_images):
        img_path = IMAGES_DIR / img_file
        arts_str = ", ".join(a["title"][:40] for a in articles[:3])
        print(f"[{i+1:02d}/{len(unique_images)}] {img_file} ({len(articles)} art.)",
              flush=True)
        print(f"    📰 {arts_str}...", flush=True)

        try:
            b64 = base64.b64encode(img_path.read_bytes()).decode()
            res = gemini_validate(key, b64, articles)
            score = res.get("score", 0)
            reason = res.get("reason", "")
            pq = res.get("pexels_query", "")
            em = "✅" if score >= 7 else ("⚠️ " if score >= 5 else "❌")
            print(f"    {em} {score}/10 — {reason}", flush=True)
            if pq:
                print(f"    🔍 Pexels: \"{pq}\"", flush=True)
            image_results[img_file] = {
                "score": score, "reason": reason,
                "pexels_query": pq, "articles_count": len(articles),
                "needs_replacement": score < 6
            }
        except Exception as e:
            print(f"    ❌ Błąd: {e}", flush=True)
            image_results[img_file] = {
                "score": -1, "reason": str(e),
                "pexels_query": "", "articles_count": len(articles),
                "needs_replacement": False
            }

        if i < len(unique_images) - 1:
            print(f"    ⏱  Czekam {DELAY_BETWEEN}s...\n", flush=True)
            time.sleep(DELAY_BETWEEN)
        else:
            print()

    # Podsumowanie
    print("\n" + "="*60, flush=True)
    print("📊 PODSUMOWANIE", flush=True)
    print("="*60, flush=True)

    bad  = [(f, r) for f, r in image_results.items() if r["score"] < 6 and r["score"] >= 0]
    warn = [(f, r) for f, r in image_results.items() if 6 <= r["score"] < 7]
    good = [(f, r) for f, r in image_results.items() if r["score"] >= 7]

    print(f"✅ Dobre ({len(good)}): {', '.join(f for f,_ in good)}", flush=True)
    if warn:
        print(f"⚠️  Akceptowalne ({len(warn)}): {', '.join(f for f,_ in warn)}", flush=True)
    if bad:
        print(f"\n❌ DO WYMIANY ({len(bad)}):", flush=True)
        for f, r in bad:
            print(f"  {f}: {r['score']}/10 — {r['reason']}", flush=True)
            if r["pexels_query"]:
                print(f"    → Pexels: \"{r['pexels_query']}\"", flush=True)
            # Które artykuły dostaną lepsze zdjęcie?
            for art in image_articles[f]:
                print(f"    • {art['title'][:60]}", flush=True)

    # Zapisz JSON
    final = {
        "summary": {
            "total_images": len(unique_images),
            "good": len(good), "warn": len(warn), "bad": len(bad),
        },
        "images": image_results,
    }
    OUT_FILE.write_text(json.dumps(final, ensure_ascii=False, indent=2))
    print(f"\n💾 Wyniki → {OUT_FILE}", flush=True)

if __name__ == "__main__":
    main()
