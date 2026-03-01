# 15 Topic-Specific Blog Images — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current 6 generic category images with 15 topic-specific images, giving every one of 40 blog posts a thematically correct photo.

**Architecture:** Download 15 Pexels CC0 images to `public/images/blog/`. Run a Python script that reads each post's `tags:` field, matches against a priority keyword table, and writes the correct `image_url:`. Update fallbackPosts in BlogPage.tsx manually.

**Tech Stack:** Python 3, curl (image download), sed (YAML update), TypeScript (BlogPage.tsx)

---

## Final Image → Post Distribution

| Image file | Posts # | Post slugs (for reference) |
|---|---|---|
| `okna-drzwi.jpg` | 1 | okna-drzwi-certyfikacja |
| `izolacja.jpg` | 1 | wyroby-izolacyjne-normy |
| `beton.jpg` | 1 | beton-prefabrykaty-wymagania |
| `digital-qr.jpg` | 5 | paszport-produktu, digital-dop, digital-dop-harmonogram, cyfrowy-paszport-produktu, qr-kod-unikalny |
| `epd-srodowisko.jpg` | 4 | epd-w-budownictwie, wyroby-uzywane, avs-3plus-walidacja-epd, oznakowanie-ekologiczne |
| `gwp-wegiel.jpg` | 2 | gwp-obowiazkowe, gpp-zielone-zamowienia |
| `inspekcja-gunb.jpg` | 3 | nadzor-rynku-gunb, kontrole-gunb, kary-naruszenie |
| `fabryka-fpc.jpg` | 3 | zakladowa-kontrola-fpc, checklist-producenta, fpc-zakladowa |
| `import-handel.jpg` | 2 | import-wyrobow-spoza-ue, importer-obowiazki |
| `laboratorium.jpg` | 4 | jednostki-notyfikowane, systemy-avcp, avs-vs-avcp, certyfikacja-krok-po-kroku |
| `marketplace-online.jpg` | 2 | platformy-handlowe-online, sprzedaz-online |
| `oznakowanie-ce.jpg` | 1 | oznakowanie-ce-2026 |
| `normy-eta.jpg` | 7 | eta-krajowe, normy-zharmonizowane-2026, svhc-reach-dopc, jak-czytac-norme, eta-vs-norma, dopc-szablon, nowe-normy-zharmonizowane |
| `certyfikacja-audit.jpg` | 1 | dop-do-dopc-zmiany |
| `cpr-przepisy.jpg` | 3 | cpr-2024-nowe-rozporzadzenie, cpr-2024-pierwsze-tygodnie, mala-firma *(fallback)* |
| **Total** | **40** | |

---

## Task 1: Download 15 Pexels images

**Files:**
- Modify: `public/images/blog/` (add 15 new .jpg files; existing 6 stay as backup)

**Step 1: Run download script**

```bash
cd /Users/admin/Downloads/nowy-cpr-pl

# Each curl tries primary ID first, fallbacks if <10KB
download_image() {
  local filename=$1
  shift
  local dest="public/images/blog/$filename"
  for id in "$@"; do
    url="https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800"
    curl -L -s -o "$dest" "$url"
    size=$(wc -c < "$dest")
    if [ "$size" -gt 10000 ]; then
      echo "✓ $filename ($size bytes) from photo $id"
      return 0
    else
      echo "  ✗ photo $id too small ($size bytes), trying next..."
    fi
  done
  echo "  FAIL: could not download $filename"
  return 1
}

# Topic → Pexels photo IDs (primary + 2 fallbacks each)
download_image "okna-drzwi.jpg"        2119713  1396122  443383
download_image "izolacja.jpg"          5998245  8487370  5256338
download_image "beton.jpg"             1216589  2219024  209251
download_image "digital-qr.jpg"        4050291  8728380  6963098
download_image "epd-srodowisko.jpg"    2101137  302083   618613
download_image "gwp-wegiel.jpg"        221012   1850626  387256
download_image "inspekcja-gunb.jpg"    8293778  5668474  3760613
download_image "fabryka-fpc.jpg"       1108101  2760244  2884509
download_image "import-handel.jpg"     1427107  1427108  142710
download_image "oznakowanie-ce.jpg"    4483608  5632371  3616764
download_image "laboratorium.jpg"      2280571  3912981  3735688
download_image "marketplace-online.jpg" 3944405 1029757  1779487
download_image "certyfikacja-audit.jpg" 3183150 1181406  7688083
download_image "normy-eta.jpg"         834892   7755201  1109541
download_image "cpr-przepisy.jpg"      4427760  6077377  5668870
```

**Step 2: Verify all 15 downloaded**

```bash
ls -lh public/images/blog/*.jpg | awk '{print $5, $9}' | sort
# Expected: 15+ files, each >10K
# You should see the new 15 PLUS the old 6 (certyfikacja.jpg, prawo.jpg, etc.)
```

If any file is missing or <10KB, search Pexels manually at https://www.pexels.com/search/[topic]/ and replace the ID.

**Step 3: Commit**

```bash
git add public/images/blog/
git commit -m "feat: add 15 topic-specific blog images (Pexels CC0)"
```

---

## Task 2: Create and run image-assignment script

**Files:**
- Create: `scripts/assign_blog_images.py`
- Modify: `content/blog/*.md` (image_url field in 40 files)

**Step 1: Create the script**

```bash
cat > scripts/assign_blog_images.py << 'PYEOF'
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

    (["epd", "ecolabel", "etykietowanie środowiskowe",
      "wyroby używane", "odzysk", "en 15804"],
     "epd-srodowisko.jpg"),

    (["gwp", "gpp", "ślad węglowy", "zielone zamówienia"],
     "gwp-wegiel.jpg"),

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
PYEOF
chmod +x scripts/assign_blog_images.py
```

**Step 2: Run dry-run first (review output)**

```bash
python3 scripts/assign_blog_images.py 2>&1
```

Expected output — verify against the distribution table at top of this plan:
```
okna-drzwi-certyfikacja.md     → okna-drzwi.jpg
wyroby-izolacyjne-normy.md     → izolacja.jpg
beton-prefabrykaty-wymagania.md → beton.jpg
...
Processing 40 blog posts...
Done.
```

If any assignment looks wrong, fix the MAPPINGS list in the script before continuing.

**Step 3: Verify image_url values updated**

```bash
grep "image_url" content/blog/*.md | sort -t: -k3 | awk -F: '{print $3}' | sort | uniq -c | sort -rn
```

Expected — approximate counts (15 distinct images across 40 posts):
```
  7 /images/blog/normy-eta.jpg
  5 /images/blog/digital-qr.jpg
  4 /images/blog/epd-srodowisko.jpg
  4 /images/blog/laboratorium.jpg
  3 /images/blog/inspekcja-gunb.jpg
  3 /images/blog/fabryka-fpc.jpg
  3 /images/blog/cpr-przepisy.jpg
  ...
```

**Step 4: Commit**

```bash
git add scripts/assign_blog_images.py content/blog/
git commit -m "feat: assign 15 topic-specific images to all 40 blog posts"
```

---

## Task 3: Update BlogPage.tsx fallbackPosts

The `fallbackPosts` array in `src/components/BlogPage.tsx` is used when markdown loading fails. Each hardcoded post object has an `image` property that needs updating.

**Files:**
- Modify: `src/components/BlogPage.tsx`

**Step 1: Read the file to see current fallbackPosts**

```bash
grep -n "image:" src/components/BlogPage.tsx | head -20
```

**Step 2: Apply replacements using the category → image mapping**

Find each post object in `fallbackPosts` and update its `image:` field using this mapping:

| If post is about... | Use image |
|---|---|
| windows, doors | `/images/blog/okna-drzwi.jpg` |
| insulation, EPS | `/images/blog/izolacja.jpg` |
| concrete, precast | `/images/blog/beton.jpg` |
| QR, digital, DPP, paszport | `/images/blog/digital-qr.jpg` |
| EPD, environment, ecolabel | `/images/blog/epd-srodowisko.jpg` |
| GWP, carbon, GPP | `/images/blog/gwp-wegiel.jpg` |
| GUNB, market surveillance, fines | `/images/blog/inspekcja-gunb.jpg` |
| FPC, factory, checklist | `/images/blog/fabryka-fpc.jpg` |
| import, importer | `/images/blog/import-handel.jpg` |
| notified bodies, ITT, lab | `/images/blog/laboratorium.jpg` |
| marketplace, e-commerce | `/images/blog/marketplace-online.jpg` |
| CE marking, labeling | `/images/blog/oznakowanie-ce.jpg` |
| ETA, standards, REACH, SVHC | `/images/blog/normy-eta.jpg` |
| certification process | `/images/blog/certyfikacja-audit.jpg` |
| CPR general, DoP&C, regulations | `/images/blog/cpr-przepisy.jpg` |

**Step 3: Verify no old Unsplash/category paths remain in fallbackPosts**

```bash
grep -n "unsplash\|/images/blog/certyfikacja\|/images/blog/prawo\|/images/blog/materialy\|/images/blog/aktualnosci\|/images/blog/cyfryzacja\|/images/blog/srodowisko" src/components/BlogPage.tsx
```

Expected: zero matches (all old category images replaced with topic-specific ones).

Note: The 6 old images (`certyfikacja.jpg`, `prawo.jpg`, etc.) can remain in `public/images/blog/` as a safe fallback — they're just no longer actively assigned.

**Step 4: Commit**

```bash
git add src/components/BlogPage.tsx
git commit -m "feat: update BlogPage.tsx fallbackPosts to use 15 topic-specific images"
```

---

## Task 4: Build & deploy

**Step 1: Local build check**

```bash
npm run build 2>&1 | tail -20
```

Expected: no errors, `dist/` created.

**Step 2: Verify images exist in build output**

```bash
ls dist/images/blog/*.jpg | wc -l
# Expected: 21 (15 new + 6 old)
```

**Step 3: Deploy to GitHub Pages**

```bash
git push origin main
```

Monitor Actions tab: https://github.com/[user]/nowy-cpr-pl/actions

**Step 4: Smoke test live site**

Open 5 representative blog posts and check images are correct:
- `/blog/okna-drzwi-certyfikacja` → windows/doors photo
- `/blog/digital-dop` → QR/digital photo
- `/blog/nadzor-rynku-gunb` → inspector photo
- `/blog/epd-w-budownictwie` → green building photo
- `/blog/import-wyrobow-spoza-ue` → shipping containers photo

---

## Notes

- **Old 6 images kept** — they remain in `public/images/blog/` (no deletion needed). Only the `image_url` assignments change.
- **Script reusable** — if new posts are added, run `python3 scripts/assign_blog_images.py` again to assign images automatically.
- **Pexels fallback** — if a primary photo ID returns a 404 or <10KB file, try the backup IDs in the `download_image` call. Find alternates at https://www.pexels.com/search/[topic]/
- **hEN keyword caution** — the script lowercases all keywords, so "hEN" becomes "hen". Since "hen" could theoretically match an unrelated Polish word, this is noted but unlikely to cause problems in this domain.
