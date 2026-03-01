#!/usr/bin/env python3
"""
Walidacja dopasowania zdjęć do artykułów — TEXT ONLY (bez wysyłania obrazów).
Używa Gemini 2.5 Flash z opisem zdjęcia (nazwa pliku + wcześniej znane info).
Znacznie wyższy rate limit: 1000+ RPM zamiast 10 RPM dla multimodal.
"""

import re, json, time, sys, urllib.request, urllib.error
from pathlib import Path
from collections import defaultdict

PROJECT_ROOT = Path("/Users/admin/Downloads/nowy-cpr-pl")
CONTENT_DIR  = PROJECT_ROOT / "content" / "blog"
IMAGES_DIR   = PROJECT_ROOT / "public" / "images" / "blog"
OUT_FILE     = PROJECT_ROOT / "scripts" / "validation_results.json"

GEMINI_MODEL = "gemini-flash-latest"

# Co wiemy o każdym zdjęciu (z poprzednich sesji + nazwy plików)
IMAGE_DESCRIPTIONS = {
    "aktualnosci.jpg":      "newspaper headlines, news articles",
    "beton.jpg":            "concrete blocks or construction with concrete",
    "certyfikacja-audit.jpg": "business people meeting from above, audit scene",
    "certyfikacja.jpg":     "CE certification mark or document",
    "cpr-przepisy.jpg":     "legal document with pen on desk",
    "cyfryzacja.jpg":       "digital technology, computer screens",
    "digital-qr.jpg":       "person scanning QR code on product jars in store",
    "epd-srodowisko.jpg":   "Bosco Verticale green building with trees on balconies",
    "fabryka-fpc.jpg":      "heavy industrial factory with crane, workers in orange vests",
    "gwp-wegiel.jpg":       "coal or carbon emissions, environmental",
    "import-handel.jpg":    "aerial view of shipping container port",
    "inspekcja-gunb.jpg":   "official at desk with legal documents, scales of justice",
    "izolacja.jpg":         "worker installing pink fiberglass mineral wool insulation",
    "laboratorium.jpg":     "scientist with laboratory flask or microscope",
    "marketplace-online.jpg": "person with credit card at laptop, online shopping",
    "materialy.jpg":        "building materials",
    "normy-eta.jpg":        "construction plans, drill, screws — technical documentation",
    "okna-drzwi.jpg":       "windows and doors in a building",
    "oznakowanie-ce.jpg":   "CE marking label or product certification",
    "prawo.jpg":            "law books or legal gavel",
    "srodowisko.jpg":       "environment, green nature or sustainability",
}

def load_key():
    for line in (PROJECT_ROOT / ".env").read_text().splitlines():
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

def gemini_text(key, prompt):
    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"{GEMINI_MODEL}:generateContent?key={key}")
    data = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 300}
    }).encode()
    req = urllib.request.Request(url, data=data,
                                 headers={"Content-Type": "application/json"})
    for attempt in range(3):
        try:
            r = json.load(urllib.request.urlopen(req, timeout=20))
            return r["candidates"][0]["content"]["parts"][0]["text"].strip()
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 15 * (attempt + 1)
                print(f"  ⏳ 429 — czekam {wait}s...", flush=True)
                time.sleep(wait)
            else:
                raise
    raise RuntimeError("Rate limit")

def validate_match(key, img_file, articles):
    desc = IMAGE_DESCRIPTIONS.get(img_file, f"photo described by filename: {img_file}")
    arts_list = "\n".join(
        f"  - \"{a['title']}\" (tagi: {a['tags']}, opis: {a['excerpt'][:100]})"
        for a in articles[:5]
    )
    prompt = f"""Jesteś ekspertem od redakcji bloga o przepisach budowlanych UE (CPR - Construction Products Regulation).

ZDJĘCIE: {img_file}
Zawartość zdjęcia: {desc}

To zdjęcie jest używane jako miniatura dla tych artykułów:
{arts_list}

Zadanie: Oceń jak dobrze to zdjęcie pasuje do tych artykułów (1-10).
- 9-10: idealnie pasuje wizualnie i tematycznie
- 7-8: dobrze pasuje, tematy powiązane
- 5-6: ogólnie ok, ale mogłoby być lepsze
- 3-4: słabe dopasowanie, zdjęcie mylące
- 1-2: zupełnie nie pasuje

Odpowiedz TYLKO w formacie JSON (bez markdown):
{{"score": N, "reason": "<uzasadnienie po polsku, max 120 znaków>", "pexels_query": "<english search terms for better photo, ONLY if score<=5, else empty string>"}}"""

    raw = gemini_text(key, prompt)
    raw = re.sub(r"```json\s*|```\s*", "", raw).strip()
    return json.loads(raw)

def main():
    key = load_key()
    if not key or len(key) < 20:
        print("❌ Brak GEMINI_API_KEY w .env"); sys.exit(1)

    # Zbierz i pogrupuj
    image_articles = defaultdict(list)
    for md in sorted(CONTENT_DIR.glob("*.md")):
        meta = parse_fm(md)
        if not meta.get("title"): continue
        img_rel = meta.get("image_url", "").lstrip("/")
        img_file = Path(img_rel).name
        image_articles[img_file].append({
            "title": meta.get("title", ""),
            "tags": meta.get("tags", ""),
            "excerpt": meta.get("excerpt", ""),
        })

    unique = [(f, a) for f, a in sorted(image_articles.items())]
    print(f"📋 {len(unique)} unikalnych zdjęć do sprawdzenia\n", flush=True)

    results = {}
    for i, (img_file, articles) in enumerate(unique):
        print(f"[{i+1:02d}/{len(unique)}] {img_file} ({len(articles)} art.)", flush=True)
        for a in articles[:2]:
            print(f"    📰 {a['title'][:55]}", flush=True)

        try:
            res = validate_match(key, img_file, articles)
            score = res.get("score", 0)
            reason = res.get("reason", "")
            pq = res.get("pexels_query", "")
            em = "✅" if score >= 7 else ("⚠️ " if score >= 6 else "❌")
            print(f"    {em} {score}/10 — {reason}", flush=True)
            if pq:
                print(f"    🔍 Pexels: \"{pq}\"", flush=True)
            results[img_file] = {
                "score": score, "reason": reason, "pexels_query": pq,
                "articles_count": len(articles), "needs_replacement": score <= 5
            }
        except Exception as e:
            print(f"    ❌ {e}", flush=True)
            results[img_file] = {
                "score": -1, "reason": str(e), "pexels_query": "",
                "articles_count": len(articles), "needs_replacement": False
            }

        if i < len(unique) - 1:
            time.sleep(2)
        print()

    # Podsumowanie
    print("="*60, flush=True)
    print("📊 PODSUMOWANIE", flush=True)
    print("="*60, flush=True)
    bad  = [(f, r) for f, r in results.items() if 0 <= r["score"] <= 5]
    warn = [(f, r) for f, r in results.items() if r["score"] in (6,)]
    good = [(f, r) for f, r in results.items() if r["score"] >= 7]
    print(f"✅ Dobre ({len(good)}): {', '.join(f for f,_ in good)}", flush=True)
    if warn:
        print(f"⚠️  Akceptowalne ({len(warn)}): {', '.join(f for f,_ in warn)}", flush=True)
    if bad:
        print(f"\n❌ DO WYMIANY ({len(bad)}):", flush=True)
        for f, r in bad:
            print(f"  {r['score']}/10 {f}: {r['reason']}", flush=True)
            if r["pexels_query"]:
                print(f"    → Pexels query: \"{r['pexels_query']}\"", flush=True)

    final = {"summary": {"total": len(unique), "good": len(good),
                         "warn": len(warn), "bad": len(bad)},
             "images": results}
    OUT_FILE.write_text(json.dumps(final, ensure_ascii=False, indent=2))
    print(f"\n💾 Wyniki → {OUT_FILE}", flush=True)

if __name__ == "__main__":
    main()
