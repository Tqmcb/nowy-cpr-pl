#!/usr/bin/env python3
"""
Git pre-commit hook: sprawdza czy image_url w artykule pasuje do tematu.
Keyword-based matching — bez API, działa od razu.

Instalacja:
    python3 scripts/pre-commit-hook.py --install

Ręczna instalacja:
    cp scripts/pre-commit-hook.py .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
"""

import re, sys, subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

# ─── Co pokazuje każde zdjęcie (słowa kluczowe po polsku i angielsku) ──────────
IMAGE_KEYWORDS = {
    "aktualnosci.jpg":        {"aktualnosci", "news", "nowosci", "aktualny"},
    "beton.jpg":              {"beton", "concrete", "prefabrykat", "prefabrykaty"},
    "certyfikacja-audit.jpg": {"certyfikacja", "audit", "jednostka", "notyfikowana", "avcp", "avs"},
    "certyfikacja.jpg":       {"certyfikacja", "ce", "certyfikat", "oznakowanie"},
    "cpr-przepisy.jpg":       {"prawo", "przepisy", "cpr", "rozporzadzenie", "regulacje"},
    "cyfryzacja.jpg":         {"cyfryzacja", "digital", "digitalizacja", "technologia"},
    "digital-qr.jpg":         {"digital", "qr", "paszport", "dpp", "dop", "dopc",
                               "identyfikator", "kod", "cyfrowy"},
    "epd-srodowisko.jpg":     {"epd", "srodowisko", "deklaracja", "srodowiskowa", "lca"},
    "fabryka-fpc.jpg":        {"fabryka", "fpc", "kontrola", "produkcja", "zakladowa",
                               "producent", "producenta", "checklist"},
    "gwp-wegiel.jpg":         {"gwp", "wegiel", "emisje", "klimat", "carbon", "co2"},
    "import-handel.jpg":      {"import", "handel", "importer", "eksport", "celny"},
    "inspekcja-gunb.jpg":     {"inspekcja", "gunb", "nadzor", "kontrole", "rynek", "kary"},
    "izolacja.jpg":           {"izolacja", "izolacyjne", "welna", "eps", "styropian",
                               "termoizolacja", "mineral"},
    "laboratorium.jpg":       {"laboratorium", "badania", "testowanie", "badanie",
                               "certyfikacja", "certyfikacji", "avs", "avcp",
                               "jednostki", "notyfikowane", "notyfikowana", "itt"},
    "marketplace-online.jpg": {"marketplace", "online", "sprzedaz", "platforma", "sklep"},
    "materialy.jpg":          {"materialy", "wyroby", "budowlane"},
    "normy-eta.jpg":          {"normy", "eta", "norma", "zharmonizowana", "norm",
                               "harmonized", "zalacznik"},
    "okna-drzwi.jpg":         {"okna", "drzwi", "okno", "stolarka"},
    "oznakowanie-ce.jpg":     {"oznakowanie", "ce", "znak", "etykieta", "label"},
    "prawo.jpg":              {"prawo", "przepisy", "regulacje", "kary", "sankcje"},
    "recykling.jpg":          {"recykling", "uzywane", "odzysk", "odpady", "wtorne"},
    "srodowisko.jpg":         {"srodowisko", "gpp", "ekologia", "zielone", "zrownowazony"},
    "svhc-reach.jpg":         {"svhc", "reach", "substancje", "chemiczne", "niebezpieczne"},
    "szablon-dopc.jpg":       {"szablon", "dopc", "wzor", "formularz", "template"},
    "paszport-produktu.jpg":  {"paszport", "passport", "product", "digital", "warehouse"},
    "importer-obowiazki-cpr-2024.jpg":        {"budowlane", "importer", "wyroby"},
    "normy-zharmonizowane-2026.jpg":        {"normy"},
    "nowe-normy-zharmonizowane-2026.jpg":        {"normy"},
    "qr-kod-unikalny-kod-produktu-c.jpg":        {"oznakowanie"},
    "cpr-2024-pierwsze-tygodnie-sto.jpg":        {"avs"},
    "mala-firma-cpr-2024.jpg":        {"2024", "cpr", "firma", "mala", "mała", "mikroprzedsiębiorca", "obowiązki", "uproszczenia"},
    "jak-czytac-norme-zharmonizowan.jpg":        {"avcp", "avs", "certyfikacja", "norma", "zharmonizowana"},
    "eta-vs-norma-zharmonizowana.jpg":        {"certyfikacja", "eta", "norma", "zharmonizowana"},
    "kontrole-gunb-cpr-2024.jpg":        {"gunb", "oznakowanie"},
    "kary-naruszenie-cpr-2024.jpg":        {"gunb", "kary"},
    "systemy-avcp.jpg":        {"avcp", "avs", "certyfikacja", "jednostki", "notyfikowane"},
    "avs-vs-avcp-nowy-system-oceny-.jpg":        {"avcp", "avs", "certyfikacja", "jednostki", "notyfikowane"},
    "certyfikacja-krok-po-kroku.jpg":        {"certyfikacja", "oznakowanie"},
    "checklist-producenta-2026.jpg":        {"certyfikacji", "checklist", "producent"},
    "fpc-zakladowa-kontrola-produkc.jpg":        {"certyfikacja", "fpc", "producent"},
    "digital-dop.jpg":        {"cyfryzacja", "digital", "dop"},
    "digital-dop-harmonogram-2026.jpg":        {"cyfryzacja", "digital", "dop"},
    "cyfrowy-paszport-produktu-dpp-.jpg":        {"cyfrowy", "cyfryzacja", "dpp", "paszport"},
    "avs-3plus-walidacja-epd.jpg":        {"avs", "epd"},
    "oznakowanie-ekologiczne-cpr-20.jpg":        {"epd", "oznakowanie"},
    "gpp-zielone-zamowienia-publicz.jpg":        {"epd", "gpp", "gwp"},
    "sprzedaz-online-cpr-2024.jpg":        {"online", "sprzedaz"},
}

# ─── Helpers ───────────────────────────────────────────────────────────────────

def run(cmd):
    return subprocess.check_output(cmd, text=True, cwd=PROJECT_ROOT).strip()


def get_staged_md_files():
    """Zwraca listę staged plików .md z content/blog/"""
    try:
        output = run(["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"])
    except subprocess.CalledProcessError:
        return []
    return [f for f in output.splitlines()
            if f.startswith("content/blog/") and f.endswith(".md")]


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
    """
    Wyciąga słowa kluczowe z:
    1. Nazwy pliku (slug) — najdokładniejsze
    2. Pola tags — explicite słowa kluczowe
    """
    kw = set()

    # Z nazwy pliku: "2026-03-13-svhc-reach-dopc-cpr-2024.md" → {"svhc","reach","dopc","cpr"}
    slug = Path(md_filename).stem
    slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", slug)   # usuń datę
    kw.update(w for w in slug.split("-") if len(w) > 2)

    # Z tagów: ["svhc", "reach", "substancje niebezpieczne"] → {"svhc","reach","substancje",...}
    tags_raw = meta.get("tags", "").lower()
    tags_clean = re.sub(r'[\[\]"\']', '', tags_raw)
    kw.update(w.strip() for w in re.split(r'[,\s]+', tags_clean) if len(w.strip()) > 2)

    return kw


# ─── Główna logika ─────────────────────────────────────────────────────────────

def validate():
    staged = get_staged_md_files()
    if not staged:
        return []

    errors = []
    for rel_path in staged:
        path = PROJECT_ROOT / rel_path
        if not path.exists():
            continue

        meta = parse_front_matter(path)
        img_rel = meta.get("image_url", "").lstrip("/")
        if not img_rel:
            continue

        img_file = Path(img_rel).name
        if img_file not in IMAGE_KEYWORDS:
            # Nieznane zdjęcie — pomiń, żeby nie blokować
            continue

        art_kw  = article_keywords(rel_path, meta)
        img_kw  = IMAGE_KEYWORDS[img_file]
        overlap = art_kw & img_kw

        if not overlap:
            errors.append({
                "file":    rel_path,
                "title":   meta.get("title", "?")[:70],
                "image":   img_file,
                "img_kw":  sorted(img_kw),
                "art_kw":  sorted(art_kw),
            })

    return errors


def print_errors(errors):
    print("\n" + "=" * 62)
    print("🚫  PRE-COMMIT: Zdjęcie nie pasuje do artykułu!")
    print("=" * 62)
    for e in errors:
        print(f"\n  📄  {e['file']}")
        print(f"  Tytuł:   {e['title']}")
        print(f"  Zdjęcie: {e['image']}")
        print(f"    ↳ pokazuje: {', '.join(e['img_kw'])}")
        print(f"    ↳ artykuł: {', '.join(e['art_kw'])}")
        print(f"    ✗ BRAK wspólnych słów kluczowych!")
    print()
    print("  💡 Zmień image_url na pasujące zdjęcie i dodaj ponownie do stage.")
    print("  💡 Lista zdjęć i ich tematy: scripts/pre-commit-hook.py (IMAGE_KEYWORDS)")
    print("  ⚠️  Aby ominąć (tylko jeśli wiesz co robisz): git commit --no-verify")
    print()


def install():
    """Instaluje hook w .git/hooks/pre-commit"""
    hook_path = PROJECT_ROOT / ".git" / "hooks" / "pre-commit"
    script_path = PROJECT_ROOT / "scripts" / "pre-commit-hook.py"

    hook_content = f"""#!/bin/sh
# Walidacja zdjęć — pre-commit hook
python3 "{script_path}"
"""
    hook_path.write_text(hook_content)
    hook_path.chmod(0o755)
    print(f"✅ Hook zainstalowany: {hook_path}")
    print(f"   Skrypt:             {script_path}")
    print()
    print("Testuj: git commit -m 'test' (z błędnym zdjęciem w staged)")


# ─── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if "--install" in sys.argv:
        install()
        sys.exit(0)

    errors = validate()
    if errors:
        print_errors(errors)
        sys.exit(1)

    sys.exit(0)
