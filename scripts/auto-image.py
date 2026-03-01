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

import re, json, sys, time, urllib.request, urllib.parse, io
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


# ─── Konkretne zapytania wizualne per artykuł ────────────────────────────────
# Opisują CO MA BYĆ NA ZDJĘCIU (nie o czym jest artykuł)

ARTICLE_VISUAL_QUERIES = {
    "wyroby-izolacyjne-normy":              "mineral wool insulation worker construction site",
    "okna-drzwi-certyfikacja":              "window installation worker building site",
    "beton-prefabrykaty-wymagania":         "concrete pouring construction workers building",
    "import-wyrobow-spoza-ue":              "cargo container port shipping import",
    "eta-krajowe-oceny-techniczne":         "engineer reviewing technical document office",
    "nadzor-rynku-gunb":                    "government building inspector construction site",
    "jednostki-notyfikowane-wybor":         "quality control material testing laboratory",
    "zakladowa-kontrola-produkcji-fpc":     "factory production line quality control worker",
    "paszport-produktu":                    "product label scanning warehouse worker",
    "normy-zharmonizowane-2026":            "architect engineer technical drawings office desk",
    "systemy-avcp":                         "construction material testing engineer laboratory",
    "oznakowanie-ce-2026":                  "product certification label construction material",
    "digital-dop":                          "engineer laptop digital document construction office",
    "epd-w-budownictwie":                   "green sustainable building construction materials",
    "cpr-2024-nowe-rozporzadzenie":         "european regulation legal document construction professional",
    "cpr-2024-pierwsze-tygodnie-stosowania":"construction site professional workers building",
    "kontrole-gunb-cpr-2024":              "inspector audit clipboard building site",
    "digital-dop-harmonogram-2026":         "business meeting laptop planning office professional",
    "dop-do-dopc-zmiany-cpr-2024":          "signing official document businessman office pen",
    "gwp-obowiazkowe-cpr-2024":             "industrial carbon emission factory environment",
    "cyfrowy-paszport-produktu-dpp-cpr-2024":"tablet scanning product barcode warehouse digital",
    "avs-vs-avcp-nowy-system-oceny-cpr-2024":"quality assessment engineer construction inspection",
    "kary-naruszenie-cpr-2024":             "legal contract lawyer penalty businessmen meeting",
    "importer-obowiazki-cpr-2024":          "cargo shipping import port warehouse forklift",
    "qr-kod-unikalny-kod-produktu-cpr-2024":"barcode scanner worker warehouse product",
    "svhc-reach-dopc-cpr-2024":             "chemical safety laboratory researcher protective gloves",
    "wyroby-uzywane-cpr-2024":              "recycled building materials reuse construction site",
    "checklist-producenta-2026":            "engineer checklist clipboard factory inspection",
    "platformy-handlowe-online-cpr-2024":   "online shopping laptop store building products",
    "jak-czytac-norme-zharmonizowana-zalacznik-za": "engineer reading technical manual document desk",
    "eta-vs-norma-zharmonizowana":          "architect blueprint technical drawing review office",
    "gpp-zielone-zamowienia-publiczne-cpr-2024": "green sustainable building construction site",
    "avs-3plus-walidacja-epd":              "environmental testing building material laboratory",
    "fpc-zakladowa-kontrola-produkcji":     "factory production manager quality control inspection",
    "oznakowanie-ekologiczne-cpr-2024":     "eco label sustainable packaging green product",
    "mala-firma-cpr-2024":                  "small business owner workshop craftsman tools",
    "dopc-szablon-wyjasnienie":             "filling form paperwork office desk pen documents",
    "sprzedaz-online-cpr-2024":             "online store laptop shopping ecommerce professional",
    "certyfikacja-krok-po-kroku":           "quality certification engineer factory steps inspection",
    "nowe-normy-zharmonizowane-2026-2028":  "engineering standards technical books documents office",
}

# ─── Generowanie zapytania wyszukiwania ───────────────────────────────────────

def build_query(art_kw, meta):
    """Buduje angielskie zapytanie do Pexels na podstawie slug artykułu."""
    # Najpierw sprawdź czy mamy konkretne zapytanie wizualne dla tego artykułu
    slug_raw = meta.get("slug", "")
    # Wyciągnij slug z image_url lub z nazwy pliku
    img_url = meta.get("image_url", "")
    # Spróbuj dopasować po slug z front matter lub po kluczach słownika
    for article_slug, visual_query in ARTICLE_VISUAL_QUERIES.items():
        for kw in art_kw:
            if article_slug.replace("-", "") in "".join(sorted(art_kw)).replace("-", ""):
                pass
        # Dopasuj po kluczach słownika względem słów kluczowych artykułu
        slug_parts = set(article_slug.split("-"))
        if len(slug_parts & art_kw) >= 2:
            return visual_query

    # Fallback: ogólne zapytanie branżowe
    translated = []
    used = set()
    for kw in sorted(art_kw):
        if kw in PL_TO_EN and PL_TO_EN[kw] not in used:
            translated.append(PL_TO_EN[kw])
            used.add(PL_TO_EN[kw])
        elif re.match(r'^[a-z]+$', kw) and len(kw) > 3:
            translated.append(kw)

    if not translated:
        return "construction professional building materials worker"

    return " ".join(translated[:3])


def build_query_from_slug(md_filename):
    """Buduje zapytanie wizualne bezpośrednio z nazwy pliku markdown."""
    slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", Path(md_filename).stem)
    if slug in ARTICLE_VISUAL_QUERIES:
        return ARTICLE_VISUAL_QUERIES[slug]
    return None


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
    req = urllib.request.Request(url, headers={
        "Authorization":  api_key,
        "User-Agent":     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept":         "application/json",
        "Accept-Language":"en-US,en;q=0.9",
        "Referer":        "https://www.pexels.com/",
    })
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


# ─── OpenVerse (Creative Commons, bez klucza) ─────────────────────────────────

def openverse_search(query, variant=0, per_page=20):
    """Szuka zdjęć CC na OpenVerse. Zwraca element [variant] z listy wyników."""
    params = urllib.parse.urlencode({
        "q": query,
        "page_size": per_page,
        "page": 1,
        "license_type": "commercial",
        "extension": "jpg",
    })
    url = f"https://api.openverse.org/v1/images/?{params}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
        results = [{"url": p["url"], "title": p.get("title", "")} for p in data.get("results", [])]
        # Wybierz element 'variant' (0,1,2...) żeby każdy artykuł miał inne zdjęcie
        if results:
            idx = variant % len(results)
            return [results[idx]]
        return []
    except Exception as e:
        print(f"    ⚠️  OpenVerse błąd: {e}")
        return []


# ─── Stable Horde (Stable Diffusion, darmowy, bez klucza) ────────────────────

STABLE_HORDE_API = "https://stablehorde.net/api/v2"
STABLE_HORDE_KEY = "0000000000"   # klucz anonimowy (darmowy)

def stable_horde_generate(prompt, variant=0, timeout_s=180):
    """Generuje obraz AI przez Stable Horde. Zwraca bajty JPEG lub None."""
    try:
        from PIL import Image
    except ImportError:
        print("    ⚠️  Brak Pillow (pip3 install Pillow) → pomijam Stable Horde")
        return None

    full_prompt = (
        f"professional photo, {prompt}, construction industry, EU regulation, "
        f"high quality, natural lighting, realistic, no text, no watermark"
    )
    seed = 100 + variant * 137

    # 1. Wyślij zlecenie
    payload = json.dumps({
        "prompt": full_prompt,
        "params": {
            "width": 512, "height": 512,
            "steps": 25, "n": 1,
            "sampler_name": "k_euler",
            "seed": str(seed),
        },
        "nsfw": False, "censor_nsfw": True,
        "models": ["stable_diffusion"],
    }).encode()
    req = urllib.request.Request(
        f"{STABLE_HORDE_API}/generate/async", data=payload,
        headers={"Content-Type": "application/json",
                 "apikey": STABLE_HORDE_KEY,
                 "Client-Agent": "nowycpr:2:admin"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            job_id = json.loads(r.read())["id"]
    except Exception as e:
        print(f"    ⚠️  Stable Horde start: {e}")
        return None

    # 2. Czekaj na wynik
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        time.sleep(8)
        try:
            chk = urllib.request.Request(
                f"{STABLE_HORDE_API}/generate/check/{job_id}",
                headers={"apikey": STABLE_HORDE_KEY, "Client-Agent": "nowycpr:2:admin"},
            )
            with urllib.request.urlopen(chk, timeout=10) as r:
                status = json.loads(r.read())
            if status.get("done"):
                break
            wait = status.get("wait_time", "?")
            print(f"    ⏳ Stable Horde: czekam ~{wait}s...")
        except Exception:
            pass
    else:
        print("    ⚠️  Stable Horde: timeout")
        return None

    # 3. Pobierz URL obrazu
    try:
        res = urllib.request.Request(
            f"{STABLE_HORDE_API}/generate/status/{job_id}",
            headers={"apikey": STABLE_HORDE_KEY, "Client-Agent": "nowycpr:2:admin"},
        )
        with urllib.request.urlopen(res, timeout=10) as r:
            img_url = json.loads(r.read())["generations"][0]["img"]
    except Exception as e:
        print(f"    ⚠️  Stable Horde status: {e}")
        return None

    # 4. Pobierz webp i konwertuj na JPEG 800×534
    try:
        dl = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(dl, timeout=20) as r:
            raw = r.read()
        img = Image.open(io.BytesIO(raw)).convert("RGB").resize((800, 534), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=88)
        return buf.getvalue()
    except Exception as e:
        print(f"    ⚠️  Stable Horde konwersja: {e}")
        return None


# ─── Pollinations.ai (fallback) ───────────────────────────────────────────────

def pollinations_url(prompt, width=800, height=534):
    safe = urllib.parse.quote(
        f"professional photo, {prompt}, construction industry, EU regulation, "
        f"high quality, natural lighting, no text, no watermark"
    )
    return f"https://image.pollinations.ai/prompt/{safe}?width={width}&height={height}&nologo=true&seed=42"


# ─── Pobieranie i zapis ────────────────────────────────────────────────────────

def download_image(url, dest_path, source_label):
    """Pobiera zdjęcie z URL i zapisuje pod wskazaną ścieżkę."""
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


# ─── Znajdowanie duplikatów ────────────────────────────────────────────────────

def find_duplicates():
    """Zwraca listę artykułów które dzielą to samo zdjęcie z innym artykułem.
    Dla każdej grupy duplikatów: pierwszy artykuł (najstarszy) zachowuje oryginał,
    pozostałe są zwracane do wymiany."""
    usage = {}
    for md in sorted(CONTENT_DIR.glob("*.md")):
        meta = parse_front_matter(md)
        if not meta.get("title"):
            continue
        img_rel = meta.get("image_url", "").lstrip("/")
        if not img_rel:
            continue
        usage.setdefault(img_rel, []).append((md, meta))

    to_fix = []
    for img_rel, articles in usage.items():
        if len(articles) < 2:
            continue
        img_file = Path(img_rel).name
        # Pierwszy artykuł zachowuje oryginał, reszta dostaje nowe zdjęcia
        for idx, (md, meta) in enumerate(articles[1:], 1):
            art_kw = article_keywords(md.name, meta)
            to_fix.append({
                "md":       md,
                "meta":     meta,
                "img_file": img_file,
                "art_kw":   art_kw,
                "variant":  idx,   # różny seed/strona dla każdego duplikatu
            })
    return to_fix


# ─── Pobieranie z wariantem (żeby nie powtarzać tego samego zdjęcia) ──────────

def pexels_search_variant(query, api_key, variant=1, per_page=3):
    """Szuka na Pexels z inną stroną wyników dla każdego wariantu."""
    page = variant + 1  # strona 2, 3, 4...
    url = (f"https://api.pexels.com/v1/search?query={urllib.parse.quote(query)}"
           f"&per_page={per_page}&page={page}&orientation=landscape")
    req = urllib.request.Request(url, headers={
        "Authorization":  api_key,
        "User-Agent":     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept":         "application/json",
        "Accept-Language":"en-US,en;q=0.9",
        "Referer":        "https://www.pexels.com/",
    })
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


def pollinations_url_variant(prompt, variant=1, width=800, height=534):
    """Generuje AI-zdjęcie z innym seed dla każdego wariantu."""
    seed = 42 + variant * 137   # różny seed: 42, 179, 316, 453...
    safe = urllib.parse.quote(
        f"professional photo, {prompt}, construction industry, EU regulation, "
        f"high quality, natural lighting, no text, no watermark"
    )
    return f"https://image.pollinations.ai/prompt/{safe}?width={width}&height={height}&nologo=true&seed={seed}"


# ─── Wspólna logika pobierania ─────────────────────────────────────────────────

def fetch_and_update(md, meta, art_kw, variant, pexels_key, dry_run):
    """Pobiera nowe zdjęcie i aktualizuje plik markdown. Zwraca True przy sukcesie."""
    query = build_query_from_slug(md.name) or build_query(art_kw, meta)
    slug  = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", md.stem)[:30]
    new_name  = f"{slug}.jpg"
    dest_path = IMAGES_DIR / new_name

    source = "openverse"
    dl_url = None
    label  = ""

    # 1. Pexels (najlepsza jakość)
    if pexels_key:
        print(f"  🔎 Pexels (strona {variant+1}): szukam...", end=" ", flush=True)
        results = pexels_search_variant(query, pexels_key, variant)
        if results:
            best   = results[0]
            dl_url = best["download"]
            label  = f"Pexels #{best['id']} by {best['photographer']}"
            source = "pexels"
            print(f"znaleziono {len(results)} zdjęć")
        else:
            print("brak → OpenVerse")

    # 2. OpenVerse (CC, bez klucza)
    if not dl_url:
        print(f"  🔎 OpenVerse (wynik #{variant+1}): szukam...", end=" ", flush=True)
        # Próbuj coraz prostszych zapytań aż do skutku
        queries_to_try = [query]
        # Dodaj zapytania z samych tłumaczeń PL_TO_EN
        translated_only = " ".join(list({PL_TO_EN[k] for k in sorted(art_kw) if k in PL_TO_EN})[:2])
        if translated_only:
            queries_to_try.append(translated_only)
        queries_to_try.append("construction building")  # zawsze działa
        ov = []
        for q in queries_to_try:
            ov = openverse_search(q, variant)
            if ov:
                break
        if ov:
            dl_url = ov[0]["url"]
            label  = f"OpenVerse: {ov[0]['title'][:50]}"
            source = "openverse"
            print(f"znaleziono {len(ov)} zdjęć")
        else:
            print("brak → Pollinations.ai")

    if dry_run:
        src_name = "Pexels" if source == "pexels" else "OpenVerse" if source == "openverse" else "Stable Horde (AI)"
        print(f"  [DRY RUN] Nowe zdjęcie: {new_name}  (query: \"{query}\")")
        print(f"  [DRY RUN] Źródło: {src_name}")
        return True

    # ── Pobierz przez URL (Pexels / OpenVerse) ────────────────────────────────
    if dl_url:
        try:
            download_image(dl_url, dest_path, label)
            update_markdown_image(md, new_name)
            print(f"  ✅ Zaktualizowano image_url → /images/blog/{new_name}")
            add_to_hook_keywords(new_name, art_kw & set(PL_TO_EN.keys()) or art_kw)
            return True
        except Exception as e:
            print(f"  ⚠️  Błąd pobierania URL: {e} → próbuję Stable Horde...")

    # ── Stable Horde (AI generator, fallback) ────────────────────────────────
    print(f"  🤖 Stable Horde: generuję AI zdjęcie...")
    img_bytes = stable_horde_generate(query, variant)
    if img_bytes:
        dest_path.write_bytes(img_bytes)
        size_kb = len(img_bytes) // 1024
        print(f"    💾 Zapisano: {dest_path.name} ({size_kb} KB) [Stable Horde AI]")
        update_markdown_image(md, new_name)
        print(f"  ✅ Zaktualizowano image_url → /images/blog/{new_name}")
        add_to_hook_keywords(new_name, art_kw & set(PL_TO_EN.keys()) or art_kw)
        return True

    # ── Pollinations.ai (ostateczny fallback) ────────────────────────────────
    print(f"  ℹ️  Ostatni fallback: Pollinations.ai")
    try:
        poll_url = pollinations_url_variant(query, variant)
        download_image(poll_url, dest_path, f"Pollinations.ai seed={42+variant*137}")
        update_markdown_image(md, new_name)
        print(f"  ✅ Zaktualizowano image_url → /images/blog/{new_name}")
        add_to_hook_keywords(new_name, art_kw & set(PL_TO_EN.keys()) or art_kw)
        return True
    except Exception as e:
        print(f"  ❌ Wszystkie źródła zawiodły: {e}")
        return False


# ─── Main ──────────────────────────────────────────────────────────────────────

def main():
    auto_fix     = "--fix"         in sys.argv
    dry_run      = "--dry-run"     in sys.argv
    dedup_mode   = "--dedup"       in sys.argv
    replace_all  = "--replace-all" in sys.argv
    pexels_key   = load_pexels_key()

    # ── Tryb: podmień WSZYSTKIE zdjęcia ───────────────────────────────────────
    if replace_all:
        print("🔄 Tryb --replace-all: podmieniam zdjęcia we wszystkich artykułach...\n")
        articles = []
        for md in sorted(CONTENT_DIR.glob("*.md")):
            meta = parse_front_matter(md)
            if not meta.get("title"):
                continue
            art_kw = article_keywords(md.name, meta)
            articles.append({"md": md, "meta": meta, "art_kw": art_kw})

        print(f"📋 Znaleziono {len(articles)} artykułów\n")

        for i, item in enumerate(articles, 1):
            md     = item["md"]
            meta   = item["meta"]
            art_kw = item["art_kw"]
            title  = meta.get("title", "")[:60]
            # Używaj konkretnego zapytania wizualnego ze słownika (slug → co ma być na zdjęciu)
            query  = build_query_from_slug(md.name) or build_query(art_kw, meta)

            print(f"[{i}/{len(articles)}] {md.name}")
            print(f"  Tytuł:  {title}")
            print(f"  Query:  \"{query}\"")

            if not auto_fix:
                continue

            fetch_and_update(md, meta, art_kw, i, pexels_key, dry_run)
            print()
            time.sleep(1)

        if not auto_fix:
            print("\n💡 Aby podmienić:")
            print("   python3 scripts/auto-image.py --replace-all --fix")
        return

    # ── Tryb deduplikacji ──────────────────────────────────────────────────────
    if dedup_mode:
        print("🔍 Szukam zdublowanych zdjęć...\n")
        duplicates = find_duplicates()

        if not duplicates:
            print("✅ Każdy artykuł ma unikalne zdjęcie!")
            return

        print(f"♻️  Znaleziono {len(duplicates)} artykułów ze zdublowanymi zdjęciami:\n")
        for i, item in enumerate(duplicates, 1):
            md      = item["md"]
            meta    = item["meta"]
            img_old = item["img_file"]
            variant = item["variant"]
            art_kw  = item["art_kw"]
            title   = meta.get("title", "")[:60]

            print(f"[{i}/{len(duplicates)}] {md.name}")
            print(f"  Tytuł:   {title}")
            print(f"  Zdjęcie: {img_old}  (duplikat #{variant})")

            if not auto_fix:
                query = build_query(art_kw, meta)
                print(f"  Query:   \"{query}\"")
                print()
                continue

            fetch_and_update(md, meta, art_kw, variant, pexels_key, dry_run)
            print()
            time.sleep(1)

        if not auto_fix:
            print("💡 Aby automatycznie przypisać unikalne zdjęcia:")
            print("   python3 scripts/auto-image.py --dedup --fix")
            print("   python3 scripts/auto-image.py --dedup --fix --dry-run  # podgląd")
        return

    # ── Tryb naprawy niezgodności (domyślny) ──────────────────────────────────
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

        fetch_and_update(md, meta, art_kw, 0, pexels_key, dry_run)
        print()
        time.sleep(1)

    if not auto_fix:
        print("\n💡 Aby automatycznie pobrać i podmienić zdjęcia:")
        print("   python3 scripts/auto-image.py --fix")
        print()
        print("💡 Aby usunąć duplikaty (każdy artykuł unikalne zdjęcie):")
        print("   python3 scripts/auto-image.py --dedup --fix")
        print()
        print("💡 Aby dodać klucz Pexels (darmowy, lepsza jakość):")
        print("   https://www.pexels.com/api/  →  echo 'PEXELS_API_KEY=...' >> .env")


if __name__ == "__main__":
    main()
