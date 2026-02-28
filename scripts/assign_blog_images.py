#!/usr/bin/env python3
"""
Assign topic-specific images to blog posts based on their tags.
Priority: first matching rule wins (case-insensitive substring match).
Run from project root: python3 scripts/assign_blog_images.py
"""
import os
import re

BLOG_DIR = "content/blog"

# Priority-ordered mappings: (keywords_in_tags, image_filename)
# Case-insensitive substring match: keyword must appear IN any tag value.
MAPPINGS = [
    (["okna", "drzwi"],
     "okna-drzwi.jpg"),

    (["izolacja", "eps", "wełna", "termoizolacja"],
     "izolacja.jpg"),

    (["beton", "prefabrykaty"],
     "beton.jpg"),

    (["qr kod", "digital dop", "dpp", "paszport produktu",
      "cyfryzacja", "traceability", "identyfikacja cyfrowa"],
     "digital-qr.jpg"),

    (["gwp", "gpp", "ślad węglowy", "zielone zamówienia"],
     "gwp-wegiel.jpg"),

    (["epd", "ecolabel", "etykietowanie środowiskowe",
      "wyroby używane", "odzysk", "en 15804"],
     "epd-srodowisko.jpg"),

    (["gunb", "nadzór rynku", "kary", "sankcje", "naruszenie"],
     "inspekcja-gunb.jpg"),

    (["fpc", "zakładowa kontrola", "kontrola produkcji", "checklist"],
     "fabryka-fpc.jpg"),

    (["import", "importer", "cło"],
     "import-handel.jpg"),

    (["notyfikowan", "avs 3+", "nando"],
     "laboratorium.jpg"),

    (["marketplace", "platformy online", "sprzedaż online",
      "e-commerce", "handel elektroniczny"],
     "marketplace-online.jpg"),

    (["etykieta"],
     "oznakowanie-ce.jpg"),

    (["avcp", "system oceny", "eta", "zharmonizowa", "hen",
      "ead", "eota", "svhc", "reach", "szablon", "załącznik za"],
     "normy-eta.jpg"),

    (["certyfikacj"],
     "certyfikacja-audit.jpg"),
]

FALLBACK = "cpr-przepisy.jpg"


def get_image_for_tags(tags_line: str) -> str:
    """Return image filename for given tags: [...] line."""
    match = re.search(r'\[(.+)\]', tags_line)
    if not match:
        return FALLBACK
    raw = match.group(1)
    tags = [t.strip().strip('"').strip("'").lower() for t in raw.split(',')]

    for keywords, image in MAPPINGS:
        for kw in keywords:
            kw_lower = kw.lower()
            if any(kw_lower in tag for tag in tags):
                return image
    return FALLBACK


def process_file(filepath: str) -> None:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    tags_match = re.search(r'^tags:.*$', content, re.MULTILINE)
    if not tags_match:
        print(f"  SKIP {os.path.basename(filepath)}: no tags field")
        return

    image = get_image_for_tags(tags_match.group(0))

    new_content = re.sub(
        r'^image_url:.*$',
        f'image_url: /images/blog/{image}',
        content,
        flags=re.MULTILINE
    )

    if new_content == content:
        print(f"  UNCHANGED {os.path.basename(filepath)}")
        return

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  {os.path.basename(filepath):<60} → {image}")


if __name__ == '__main__':
    files = sorted([
        os.path.join(BLOG_DIR, f)
        for f in os.listdir(BLOG_DIR)
        if f.endswith('.md')
    ])
    print(f"Processing {len(files)} blog posts...\n")
    for filepath in files:
        process_file(filepath)
    print(f"\nDone. Check output above for any SKIPs or UNCHANGEDs.")
