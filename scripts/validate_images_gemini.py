#!/usr/bin/env python3
"""
Walidacja zdjęć blogowych przy użyciu Gemini 2.5 Flash Vision.
Sprawdza czy zdjęcie pasuje do tytułu/opisu artykułu i sugeruje lepsze query Pexels.

Użycie:
    python3 scripts/validate_images_gemini.py
"""

import os
import re
import json
import time
import base64
import urllib.request
import urllib.parse
from pathlib import Path

# ─── Konfiguracja ─────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR  = PROJECT_ROOT / "content" / "blog"
IMAGES_DIR   = PROJECT_ROOT / "public" / "images" / "blog"
ENV_FILE     = PROJECT_ROOT / ".env"

GEMINI_MODEL = "gemini-2.5-flash"
SCORE_THRESHOLD = 5  # poniżej tej oceny → sugerujemy wymianę

# ─── Helpers ──────────────────────────────────────────────────────────────────
def load_env() -> dict:
    env = {}
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
    return env

def parse_front_matter(md_path: Path) -> dict:
    text = md_path.read_text(encoding="utf-8")
    m = re.match(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
    if not m:
        return {}
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip('"')
    return meta

def image_to_base64(img_path: Path) -> str:
    return base64.b64encode(img_path.read_bytes()).decode()

def gemini_validate(api_key: str, image_b64: str, title: str, tags: str, excerpt: str) -> dict:
    """Wysyła obraz + kontekst artykułu do Gemini i dostaje ocenę dopasowania."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={api_key}"

    prompt = f"""Jesteś ekspertem od contentu dla profesjonalnego bloga o przepisach budowlanych UE (CPR - Construction Products Regulation).

Artykuł:
- Tytuł: {title}
- Tagi: {tags}
- Opis: {excerpt}

Oceń czy pokazane zdjęcie pasuje do tego artykułu w skali 1-10, gdzie:
- 10 = idealnie pasuje (np. zdjęcie wełny mineralnej dla artykułu o izolacji)
- 7-9 = dobrze pasuje, tematycznie związane
- 4-6 = ogólnie pasuje, ale mogłoby być lepsze
- 1-3 = zupełnie nie pasuje, wprowadza w błąd

Odpowiedz TYLKO w formacie JSON (bez markdown):
{{
  "score": <liczba 1-10>,
  "reason": "<krótkie uzasadnienie po polsku, max 100 znaków>",
  "pexels_query": "<angielskie słowa kluczowe do wyszukania lepszego zdjęcia, tylko jeśli score < 6>"
}}"""

    payload = {
        "contents": [{
            "parts": [
                {"inline_data": {"mime_type": "image/jpeg", "data": image_b64}},
                {"text": prompt}
            ]
        }],
        "generationConfig": {"temperature": 0.1}
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

    for attempt in range(3):
        try:
            resp = json.load(urllib.request.urlopen(req, timeout=30))
            raw = resp["candidates"][0]["content"]["parts"][0]["text"].strip()
            # Usuń markdown code blocks jeśli Gemini je dodał
            raw = re.sub(r"```json\s*", "", raw)
            raw = re.sub(r"```\s*", "", raw)
            return json.loads(raw)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 30 * (attempt + 1)
                print(f"    ⏳ Rate limit, czekam {wait}s...", flush=True)
                time.sleep(wait)
            else:
                body = e.read().decode()
                raise RuntimeError(f"HTTP {e.code}: {body[:200]}")
        except json.JSONDecodeError as e:
            raise RuntimeError(f"JSON parse error: {raw[:200]}")

    raise RuntimeError("Za dużo prób (rate limit)")

# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    env = load_env()
    api_key = env.get("GEMINI_API_KEY", "")
    if not api_key or len(api_key) < 20:
        print("❌ Brak GEMINI_API_KEY w .env")
        return

    # Zbierz wszystkie posty
    posts = []
    for md_file in sorted(CONTENT_DIR.glob("*.md")):
        meta = parse_front_matter(md_file)
        if not meta.get("title"):
            continue
        img_rel = meta.get("image_url", "").lstrip("/")  # images/blog/xxx.jpg
        img_path = PROJECT_ROOT / "public" / img_rel
        if not img_path.exists():
            print(f"⚠️  Brak pliku: {img_path.name}")
            continue
        posts.append({
            "file": md_file.name,
            "title": meta.get("title", ""),
            "tags": meta.get("tags", ""),
            "excerpt": meta.get("excerpt", ""),
            "image_file": img_path.name,
            "image_path": img_path,
        })

    print(f"📋 Znaleziono {len(posts)} artykułów\n")

    # Grupuj po pliku zdjęcia — walidujemy każde zdjęcie tylko raz
    # ale sprawdzamy dla każdego artykułu który go używa
    results = []
    validated_images = {}  # img_file → {score, reason, pexels_query}

    for i, post in enumerate(posts):
        img_file = post["image_file"]
        title = post["title"]

        # Jeśli to samo zdjęcie dla innego artykułu — sprawdzamy ponownie z nowym tytułem
        print(f"[{i+1:02d}/{len(posts)}] {img_file}")
        print(f"    📰 {title[:60]}")

        try:
            img_b64 = image_to_base64(post["image_path"])
            result = gemini_validate(
                api_key,
                img_b64,
                title=title,
                tags=post["tags"],
                excerpt=post["excerpt"],
            )
            score = result.get("score", 0)
            reason = result.get("reason", "")
            pexels_q = result.get("pexels_query", "")

            emoji = "✅" if score >= 7 else ("⚠️ " if score >= 5 else "❌")
            print(f"    {emoji} Ocena: {score}/10 — {reason}")
            if pexels_q:
                print(f"    🔍 Sugerowane Pexels query: \"{pexels_q}\"")

            results.append({
                **post,
                "image_path": str(post["image_path"]),
                "score": score,
                "reason": reason,
                "pexels_query": pexels_q,
                "needs_replacement": score < SCORE_THRESHOLD,
            })

        except Exception as e:
            print(f"    ❌ Błąd: {e}")
            results.append({**post, "image_path": str(post["image_path"]), "score": -1, "reason": str(e), "pexels_query": "", "needs_replacement": False})

        time.sleep(8)  # rate limit safety — Gemini 2.5 Flash: 10 RPM = 6s min, 8s buffer
        print()

    # ─── Podsumowanie ────────────────────────────────────────────────────────
    print("\n" + "="*60)
    print("📊 PODSUMOWANIE WALIDACJI")
    print("="*60)

    bad = [r for r in results if r["score"] < SCORE_THRESHOLD and r["score"] >= 0]
    ok  = [r for r in results if r["score"] >= SCORE_THRESHOLD]
    err = [r for r in results if r["score"] < 0]

    print(f"✅ Pasują ({len(ok)}): {', '.join(set(r['image_file'] for r in ok))}")
    if bad:
        print(f"\n❌ DO WYMIANY ({len(bad)}):")
        for r in bad:
            print(f"   {r['image_file']} (score {r['score']}) dla \"{r['title'][:50]}\"")
            if r["pexels_query"]:
                print(f"   → Pexels: \"{r['pexels_query']}\"")
    if err:
        print(f"\n⚠️  Błędy ({len(err)}): {[r['file'] for r in err]}")

    # Zapisz wyniki do JSON
    out_path = PROJECT_ROOT / "scripts" / "validation_results.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n💾 Wyniki zapisane: {out_path}")

    return results

if __name__ == "__main__":
    main()
