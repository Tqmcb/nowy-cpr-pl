#!/usr/bin/env python3
"""
Auto-fix: wykrywa artykuły z niedopasowanymi zdjęciami i pobiera lepsze.

Źródła obrazów (w kolejności priorytetu):
  1. Pexels API  — stock photos, wymaga PEXELS_API_KEY w .env
  2. Pollinations.ai — generowanie AI, ZERO konfiguracji

Użycie:
    python3 scripts/auto-image.py            # pokaż niezgodności
    python3 scripts/auto-image.py --fix      # pobierz i podmień automatycznie
    python3 scripts/auto-image.py --fix --dry-run  # podgląd bez pobierania
"""

import re, json, sys, time, urllib.request, urllib.parse
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR  = PROJECT_ROOT / "content" / "blog"
IMAGES_DIR   = PROJECT_ROOT / "public" / "images" / "blog"
HOOK_SCRIPT  = PROJECT_ROOT / "scripts" / "pre-commit-hook.py"

# ─── Tłumaczenie polskich słów kluczowych → angielskie zapytania Pexels ───────
PL_TO_EN = {
    "certyfikacja":   "certification audit",
    "certyfikacji":   "certification",
    "oznakowanie":    "product label marking",
    "izolacja":       "mineral wool insulation construction",
    "izolacyjne":     "insulation material",
    "beton":          "concrete construction",
    "prefabrykaty":   "concrete precast",
    "okna":           "windows building",
    "drzwi":          "doors building",
    "normy":          "technical standards documents",
    "norma":          "technical standard document",
    "zharmonizowana": "european standard",
    "eta":            "european technical assessment",
    "prawo":          "law legal document",
    "przepisy":       "regulations legal",
    "import":         "shipping container port",
    "handel":         "trade commerce",
    "importer":       "import trade",
    "inspekcja":      "inspection official",
    "gunb":           "building inspection official",
    "nadzor":         "supervision inspection",
    "kary":           "fine penalty legal",
    "laboratorium":   "laboratory testing",
    "badania":        "laboratory test research",
    "fpc":            "factory production control",
    "fabryka":        "factory industrial manufacturing",
    "produkcja":      "manufacturing production",
    "producent":      "manufacturer factory",
    "epd":            "environmental declaration building",
    "srodowisko":     "environment green sustainability",
    "gwp":            "carbon emissions environment",
    "wegiel":         "carbon co2 emissions",
    "recykling":      "recycling construction waste",
    "uzywane":        "used recycled building materials",
    "svhc":           "chemical hazardous substances laboratory",
    "reach":          "chemical regulation laboratory",
    "substancje":     "chemical substances",
    "digital":        "digital technology tablet",
    "cyfrowy":        "digital technology",
    "qr":             "qr code product scanning",
    "paszport":       "product passport digital construction",
    "dpp":            "digital product passport",
    "dop":            "declaration performance document",
    "dopc":           "declaration performance document form",
    "szablon":        "document form template",
    "formularz":      "form document filling",
    "marketplace":    "online marketplace ecommerce",
    "online":         "online shopping laptop",
    "sprzedaz":       "sales commerce",
    "aktualnosci":    "news headlines newspaper",
    "checklist":      "checklist business planning",
    "jednostki":      "laboratory certification testing",
    "notyfikowane":   "certification notified body",
    "avs":            "certification testing laboratory",
    "avcp":           "certification assessment",
    "materialy":      "building materials construction",
    "wyroby":         "construction products building",
    "budowlane":      "construction building",
    "gpp":            "green public procurement environment",
    "cyfryzacja":     "digital transformation technology",
}


# ─── IMAGE_KEYWORDS (kopiowany z hooka) ───────────────────────────────────────

def load_image_keywords():
    """Wczytuje IMAGE_KEYWORDS z pliku hooka."""
    src = HOOK_SCRIPT.read_text()
    m = re.search(r"IMAGE_KEYWORDS\s*=\s*(\{.*?\n\})", src, re.DOTALL)
    if m:
        return eval(m.group(1))
    return {}


# ─── Parsowanie artykułów ──────────────────────────────────────────────────────

def parse_front_matter(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
    if not m:
        return {}
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip('"')
    return meta


def article_keywords(md_filename, meta):
    kw = set()
    slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", Path(md_filename).stem)
    kw.update(w for w in slug.split("-") if len(w) > 2)
    tags_raw = meta.get("tags", "").lower()
    tags_clean = re.sub(r'[\[\]"\']', '', tags_raw)
    kw.update(w.strip() for w in re.split(r'[,\s]+', tags_clean) if len(w.strip()) > 2)
    return kw


def find_mismatches():
    """Zwraca listę artykułów z niedopasowanymi zdjęciami."""
    IMAGE_KEYWORDS = load_image_keywords()
    mismatches = []
    for md in sorted(CONTENT_DIR.glob("*.md")):
        meta = parse_front_matter(md)
        if not meta.get("title"):
            continue
        img_rel  = meta.get("image_url", "").lstrip("/")
        img_file = Path(img_rel).name
        if img_file not in IMAGE_KEYWORDS:
            continue
        art_kw  = article_keywords(md.name, meta)
        overlap = art_kw & IMAGE_KEYWORDS[img_file]
        if not overlap:
            mismatches.append({
                "md":       md,
                "meta":     meta,
                "img_file": img_file,
                "art_kw":   art_kw,
                "img_kw":   IMAGE_KEYWORDS[img_file],
            })
    return mismatches


# ─── Generowanie zapytania wyszukiwania ───────────────────────────────────────

def build_query(art_kw, meta):
    """Buduje angielskie zapytanie do Pexels/Pollinations na podstawie słów kluczowych."""
    translated = []
    used = set()
    for kw in sorted(art_kw):
        if kw in PL_TO_EN and PL_TO_EN[kw] not in used:
            translated.append(PL_TO_EN[kw])
            used.add(PL_TO_EN[kw])
        elif re.match(r'^[a-z]+$', kw) and len(kw) > 3:
            translated.append(kw)  # już po angielsku

    # Fallback: tytuł artykułu
    if not translated:
        title = meta.get("title", "")
        translated = ["construction", "building", "professional"]

    # Weź pierwsze 3 frazy, połącz
    query = " ".join(translated[:3])
    return query


# ─── Pexels API ───────────────────────────────────────────────────────────────

def load_pexels_key():
    env_file = PROJECT_ROOT / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith("PEXELS_API_KEY="):
                return line.split("=", 1)[1].strip()
    return ""


def pexels_search(query, api_key, per_page=3):
    """Wyszukuje zdjęcia na Pexels. Zwraca listę {id, url, thumb, photographer}."""
    url = f"https://api.pexels.com/v1/search?query={urllib.parse.quote(query)}&per_page={per_page}&orientation=landscape"
    req = urllib.request.Request(url, headers={"Authorization": api_key})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
        results = []
        for p in data.get("photos", []):
            results.append({
                "id":           p["id"],
                "url":          p["url"],
                "photographer": p["photographer"],
                "thumb":        p["src"]["medium"],
                "download":     p["src"]["large"],
            })
        return results
    except Exception as e:
        print(f"    ⚠️  Pexels błąd: {e}")
        return []


# ─── Pollinations.ai (bez klucza) ─────────────────────────────────────────────

def pollinations_url(prompt, width=800, height=534):
    """Zwraca URL do AI-generowanego zdjęcia (Pollinations.ai)."""
    safe = urllib.parse.quote(
        f"professional photo, {prompt}, construction industry, EU regulation, "
        f"high quality, natural lighting, no text, no watermark"
    )
    return f"https://image.pollinations.ai/prompt/{safe}?width={width}&height={height}&nologo=true&seed=42"


# ─── Pobieranie i zapis ────────────────────────────────────────────────────────

def download_image(url, dest_path, source_label):
    """Pobiera zdjęcie pod wskazany ścieżkę."""
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    dest_path.write_bytes(data)
    size_kb = len(data) // 1024
    print(f"    💾 Zapisano: {dest_path.name} ({size_kb} KB) [{source_label}]")


def update_markdown_image(md_path, new_img_filename):
    """Aktualizuje image_url w pliku markdown."""
    text = md_path.read_text(encoding="utf-8")
    new_url = f"/images/blog/{new_img_filename}"
    updated = re.sub(
        r"(image_url:\s*).*",
        f"\\g<1>{new_url}",
        text,
        count=1
    )
    md_path.write_text(updated, encoding="utf-8")


def add_to_hook_keywords(img_filename, keywords_set):
    """Dodaje nowy wpis do IMAGE_KEYWORDS w pliku hooka."""
    src = HOOK_SCRIPT.read_text()
    kw_str = ", ".join(f'"{w}"' for w in sorted(keywords_set))
    new_entry = f'    "{img_filename}":        {{{kw_str}}},\n'

    # Wstaw przed zamykającym } słownika
    src_updated = src.replace(
        "\n}\n\n# ─── Helpers",
        f"\n{new_entry}}}\n\n# ─── Helpers"
    )
    if src_updated != src:
        HOOK_SCRIPT.write_text(src_updated)
        print(f"    📝 Dodano '{img_filename}' do IMAGE_KEYWORDS w hooku")


# ─── Main ──────────────────────────────────────────────────────────────────────

def main():
    auto_fix = "--fix" in sys.argv
    dry_run  = "--dry-run" in sys.argv
    pexels_key = load_pexels_key()

    print("🔍 Szukam niezgodności zdjęć...\n")
    mismatches = find_mismatches()

    if not mismatches:
        print("✅ Wszystkie artykuły mają pasujące zdjęcia!")
        return

    print(f"❌ Znaleziono {len(mismatches)} niezgodności:\n")

    for i, item in enumerate(mismatches, 1):
        md      = item["md"]
        meta    = item["meta"]
        img_old = item["img_file"]
        art_kw  = item["art_kw"]

        title = meta.get("title", "")[:60]
        query = build_query(art_kw, meta)

        print(f"[{i}/{len(mismatches)}] {md.name}")
        print(f"  Tytuł:   {title}")
        print(f"  Zdjęcie: {img_old}  (nie pasuje)")
        print(f"  Query:   \"{query}\"")

        if not auto_fix:
            continue

        # ── Szukaj nowego zdjęcia ──────────────────────────────────────────
        results = []
        source  = "pollinations"

        if pexels_key:
            print(f"  🔎 Pexels: szukam...", end=" ", flush=True)
            results = pexels_search(query, pexels_key)
            if results:
                source = "pexels"
                print(f"znaleziono {len(results)} zdjęć")
            else:
                print("brak wyników → Pollinations.ai")
        else:
            print(f"  ℹ️  Brak PEXELS_API_KEY → używam Pollinations.ai (AI)")

        # ── Ustal nową nazwę pliku ─────────────────────────────────────────
        slug      = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", md.stem)[:30]
        new_name  = f"{slug}.jpg"
        dest_path = IMAGES_DIR / new_name

        if dry_run:
            print(f"  [DRY RUN] Nowe zdjęcie: {new_name}")
            if results:
                r = results[0]
                print(f"  [DRY RUN] Pexels ID {r['id']} — {r['photographer']}")
                print(f"  [DRY RUN] URL: {r['url']}")
            else:
                print(f"  [DRY RUN] Pollinations query: {query}")
            print()
            continue

        # ── Pobierz ────────────────────────────────────────────────────────
        try:
            if results:
                best    = results[0]
                dl_url  = best["download"]
                label   = f"Pexels #{best['id']} by {best['photographer']}"
            else:
                dl_url  = pollinations_url(query)
                label   = "Pollinations.ai"

            download_image(dl_url, dest_path, label)
            update_markdown_image(md, new_name)
            print(f"  ✅ Zaktualizowano image_url → /images/blog/{new_name}")

            # Dodaj do słownika hooka
            add_to_hook_keywords(new_name, art_kw & set(PL_TO_EN.keys()) or art_kw)

        except Exception as e:
            print(f"  ❌ Błąd pobierania: {e}")

        print()
        time.sleep(1)

    if not auto_fix:
        print("\n💡 Aby automatycznie pobrać i podmienić zdjęcia:")
        print("   python3 scripts/auto-image.py --fix")
        print()
        print("💡 Aby dodać klucz Pexels (darmowy, lepsza jakość):")
        print("   https://www.pexels.com/api/  →  echo 'PEXELS_API_KEY=...' >> .env")
        print()
        print("💡 Bez klucza używa Pollinations.ai (AI, zero konfiguracji)")


if __name__ == "__main__":
    main()
