#!/usr/bin/env python3
"""
Assign topic-specific images to blog posts based on their tags.
Priority: first matching rule wins (case-insensitive substring match).
Run from project root: python3 scripts/assign_blog_images.py

To add new image mappings: add a tuple to MAPPINGS (order matters — first match wins).
To add new posts: just run the script again after adding the .md file.
"""
import csv
import io
import os
import re

BLOG_DIR = "content/blog"

# Priority-ordered mappings: (keywords_in_tags, image_filename)
# Case-insensitive SUBSTRING match: keyword must be found inside any tag value.
# Order matters — first matching rule wins. Move more-specific rules above broader ones.
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

    # GWP/carbon BEFORE epd — GWP posts often also carry "EPD" as a secondary tag
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


def parse_tags(tags_line: str) -> list[str]:
    """
    Parse tags from a YAML front matter line like:
      tags: ["foo", "bar, baz", "qux"]
    Returns a list of lowercased tag strings.
    Handles tags that contain commas by using csv parsing on the bracket contents.
    """
    match = re.search(r'\[(.+)\]', tags_line)
    if not match:
        return []
    raw = match.group(1)
    try:
        reader = csv.reader(io.StringIO(raw))
        tokens = next(reader, [])
    except Exception:
        tokens = raw.split(',')
    return [t.strip().strip('"').strip("'").lower() for t in tokens]


def get_image_for_tags(tags: list[str]) -> tuple[str, bool]:
    """
    Return (image_filename, is_fallback) for the given tag list.
    is_fallback=True means no rule matched; image is the default.
    """
    for keywords, image in MAPPINGS:
        for kw in keywords:
            kw_lower = kw.lower()
            if any(kw_lower in tag for tag in tags):
                return image, False
    return FALLBACK, True


def replace_in_front_matter(content: str, image: str) -> str:
    """
    Replace image_url only inside the YAML front matter block (between the
    opening --- and closing ---), leaving the post body untouched.
    """
    # Front matter is the block between the first --- and the second ---
    parts = content.split('---', 2)
    if len(parts) < 3:
        # No proper front matter delimiters — fall back to whole-file replace
        return re.sub(
            r'^image_url:.*$',
            f'image_url: /images/blog/{image}',
            content,
            flags=re.MULTILINE,
        )
    front = re.sub(
        r'^image_url:.*$',
        f'image_url: /images/blog/{image}',
        parts[1],
        flags=re.MULTILINE,
    )
    return '---' + front + '---' + parts[2]


def process_file(filepath: str) -> None:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    tags_match = re.search(r'^tags:.*$', content, re.MULTILINE)
    if not tags_match:
        print(f"  SKIP     {os.path.basename(filepath)}: no tags field found")
        return

    tags = parse_tags(tags_match.group(0))
    image, is_fallback = get_image_for_tags(tags)

    if is_fallback:
        print(f"  FALLBACK {os.path.basename(filepath)}: no rule matched {tags[:3]}... → {image}")

    new_content = replace_in_front_matter(content, image)

    if new_content == content:
        return  # already correct, no write needed

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    marker = "FALLBACK" if is_fallback else "       "
    print(f"  {marker} {os.path.basename(filepath):<58} → {image}")


if __name__ == '__main__':
    files = sorted([
        os.path.join(BLOG_DIR, f)
        for f in os.listdir(BLOG_DIR)
        if f.endswith('.md')
    ])
    print(f"Processing {len(files)} blog posts...\n")
    for filepath in files:
        process_file(filepath)
    print("\nDone.")
