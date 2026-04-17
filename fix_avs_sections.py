#!/usr/bin/env python3
"""
Transform '## System AVS i certyfikacja' sections in wyroby markdown files:
- Rename heading to '## System oceny zgodności — OBECNY i PRZYSZŁY'
- Add warning callout about hTS
- Add TERAZ subsection (existing content, AVS→AVCP terminology fix)
- Add PRZYSZŁOŚĆ subsection (brief boilerplate)
"""
import re
import os
import sys

WYROBY_DIR = '/home/user/nowy-cpr-pl/content/wyroby'

FILES_TO_FIX = [
    'armatura-sanitarna.md', 'cement-spoiwa.md', 'drabiny.md', 'fasady-strukturalne.md',
    'geosyntetyki.md', 'izolacja-termiczna.md', 'kanalizacja.md', 'kleje-budowlane.md',
    'kominy.md', 'kruszywa.md', 'laczniki-kotwy.md', 'membrany.md',
    'ochrona-przeciwpozarowa.md', 'okna-drzwi-bramy.md', 'plyty-drewnopochodne.md',
    'podlogi-posadzki.md', 'pokrycia-dachowe.md', 'prefabrykaty-betonowe.md',
    'rury-zbiorniki.md', 'stal-zbrojeniowa.md', 'szklo-budowlane.md', 'tynki-okladziny.md',
    'urzadzenia-gasnicze.md', 'urzadzenia-grzewcze.md', 'uszczelnienia.md',
    'wyposazenie-drog.md', 'wyroby-do-betonu.md', 'wyroby-drogowe.md',
    'wyroby-gipsowe.md', 'wyroby-murowe.md', 'wyroby-woda-pitna.md', 'zestawy-budowlane.md'
]


def parse_frontmatter(content):
    """Extract YAML frontmatter fields family_number, normy, avs_system."""
    fm = {}
    if not content.startswith('---'):
        return fm
    end = content.find('---', 3)
    if end == -1:
        return fm
    for line in content[3:end].split('\n'):
        line = line.strip()
        if line.startswith('family_number:'):
            try:
                fm['family_number'] = int(line.split(':', 1)[1].strip())
            except ValueError:
                fm['family_number'] = line.split(':', 1)[1].strip()
        elif line.startswith('avs_system:'):
            fm['avs_system'] = line.split(':', 1)[1].strip().strip('"')
        elif line.startswith('normy:'):
            val = line.split(':', 1)[1].strip()
            if val.startswith('['):
                # inline list: ["EN 197-1", "EN 459-1"]
                items = re.findall(r'"([^"]+)"', val)
                fm['normy'] = items[:3]
    return fm


def avs_to_avcp(text):
    """
    Replace AVS system numbers with AVCP equivalents in text.
    Preserves 'AVS 3+' (CPR 2024 environmental system, not an AVCP system).
    Uses placeholder technique to safely protect 'AVS 3+' from being modified.
    """
    PLACEHOLDER = '__AVS3PLUS__'
    # Protect "AVS 3+" first (with various surrounding chars)
    text = re.sub(r'\bAVS 3\+', PLACEHOLDER, text)
    # Now replace all remaining "AVS N" patterns (N = 1, 1+, 2, 2+, 3, 4)
    text = re.sub(r'\bAVS (1\+?|2\+?|3|4)\b', lambda m: 'AVCP ' + m.group(1), text)
    # Restore "AVS 3+"
    text = text.replace(PLACEHOLDER, 'AVS 3+')
    return text


def build_normy_hint(normy):
    if not normy:
        return 'aktualne normy zharmonizowane'
    return ', '.join(normy[:3])


def transform_file(filepath, dry_run=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip already-transformed files
    if '### TERAZ' in content or '## System oceny zgodności' in content:
        return 'SKIP'

    fm = parse_frontmatter(content)
    family_number = fm.get('family_number', '?')
    avs_system = fm.get('avs_system', '?')
    normy = fm.get('normy', [])
    normy_hint = build_normy_hint(normy)

    # Find the System AVS section
    section_match = re.search(r'\n## System AVS i certyfikacja\n', content)
    if not section_match:
        return 'NO_SECTION'

    section_start = section_match.start()  # points to the \n before ##
    section_heading_end = section_match.end()  # points right after \n

    # Find where section ends (next ## heading at same level)
    next_section = re.search(r'\n## ', content[section_heading_end:])
    if next_section:
        section_end = section_heading_end + next_section.start()
    else:
        section_end = len(content)

    # Extract existing section body (without the heading line)
    existing_body = content[section_heading_end:section_end]

    # Convert AVS→AVCP terminology in the existing body for the TERAZ part
    teraz_body = avs_to_avcp(existing_body)

    # Build the warning callout
    callout = (
        f'> ⚠️ Do czasu publikacji nowej hTS dla rodziny {family_number} '
        f'obowiązuje AVCP z CPR 305/2011 i aktualne normy zharmonizowane ({normy_hint}). '
        f'Nowy system AVS wejdzie w życie dla tej rodziny dopiero po publikacji hTS.\n'
    )

    # Build PRZYSZŁOŚĆ section
    przyszlosc = (
        f'\n### W PRZYSZŁOŚCI — system AVS (po publikacji hTS)\n'
        f'\n'
        f'Nowa hTS dla rodziny {family_number} określi poziom AVS. '
        f'Na podstawie dotychczasowego systemu AVCP ({avs_system}) można spodziewać się '
        f'zbliżonego poziomu rygoru — konkretne wymagania zostaną określone w Załączniku ZA nowej hTS.\n'
        f'\n'
        f'Niezależnie od poziomu AVS dla właściwości użytkowych, producent deklarujący '
        f'właściwości środowiskowe (GWP/LCA) w DoP&C będzie mógł korzystać z '
        f'**Systemu AVS 3+** — walidacja danych EPD przez notyfikowane laboratorium techniczne (NTL).\n'
    )

    # Assemble new section
    new_section = (
        '\n## System oceny zgodności — OBECNY i PRZYSZŁY\n'
        '\n'
        + callout
        + '\n'
        '### TERAZ — system AVCP (CPR 305/2011 + Załącznik ZA norm)\n'
        + teraz_body
        + przyszlosc
    )

    new_content = content[:section_start] + new_section + content[section_end:]

    if not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

    return 'FIXED'


def main():
    dry_run = '--dry-run' in sys.argv
    fixed = skipped = no_section = 0

    for filename in FILES_TO_FIX:
        filepath = os.path.join(WYROBY_DIR, filename)
        if not os.path.exists(filepath):
            print(f'MISSING: {filename}')
            continue
        result = transform_file(filepath, dry_run=dry_run)
        if result == 'FIXED':
            fixed += 1
            print(f'FIXED: {filename}')
        elif result == 'SKIP':
            skipped += 1
            print(f'SKIP:  {filename}')
        else:
            no_section += 1
            print(f'WARN:  {filename} — {result}')

    print(f'\nDone: {fixed} fixed, {skipped} skipped, {no_section} warnings')
    if dry_run:
        print('(dry-run mode — no files written)')


if __name__ == '__main__':
    main()
