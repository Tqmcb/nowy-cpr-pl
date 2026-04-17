#!/usr/bin/env python3
"""
Replace stale 'AVS X' mentions with 'AVCP X' throughout wyroby files,
but ONLY outside the PRZYSZŁOŚĆ subsection (where AVS terminology is correct).

Rules:
- 'AVS 3+' always preserved (new CPR 2024 environmental system).
- In '### W PRZYSZŁOŚCI' subsection: keep 'AVS N' as-is (future system).
- Everywhere else (frontmatter excerpt/tags, TERAZ subsection already fixed,
  ## Przykłady, ## Checklist, ## Harmonogram, ## Zmiany, ## Kluczowe, etc.):
  replace 'AVS N' with 'AVCP N'.
"""
import re
import os
import sys

WYROBY_DIR = '/home/user/nowy-cpr-pl/content/wyroby'

# All files that went through TERAZ/PRZYSZŁOŚĆ transformation
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


def avs_to_avcp_block(text):
    """Replace 'AVS N' -> 'AVCP N' in text, preserving 'AVS 3+'."""
    PLACEHOLDER = '\x00AVS3PLUS\x00'
    text = re.sub(r'\bAVS 3\+', PLACEHOLDER, text)
    text = re.sub(r'\bAVS (1\+?|2\+?|3|4)\b', lambda m: 'AVCP ' + m.group(1), text)
    text = text.replace(PLACEHOLDER, 'AVS 3+')
    return text


def transform(content):
    """Apply AVS->AVCP outside PRZYSZŁOŚĆ subsection."""
    # Split into segments based on ### W PRZYSZŁOŚCI boundary
    przyszlosc_pattern = re.compile(
        r'(### W PRZYSZŁOŚCI.*?)(?=\n## |\Z)',
        re.DOTALL
    )
    segments = []
    last_end = 0
    for m in przyszlosc_pattern.finditer(content):
        segments.append(('normal', content[last_end:m.start()]))
        segments.append(('future', m.group(1)))
        last_end = m.end()
    segments.append(('normal', content[last_end:]))

    # Transform normal segments, keep future segments as-is
    out = []
    for kind, seg in segments:
        if kind == 'normal':
            out.append(avs_to_avcp_block(seg))
        else:
            out.append(seg)
    return ''.join(out)


def main():
    dry_run = '--dry-run' in sys.argv
    total_changes = 0
    for fn in FILES_TO_FIX:
        fp = os.path.join(WYROBY_DIR, fn)
        with open(fp, 'r', encoding='utf-8') as f:
            original = f.read()
        new = transform(original)
        if new != original:
            # Count changes
            orig_avs = len(re.findall(r'\bAVS (1\+?|2\+?|3|4)\b', original))
            new_avs = len(re.findall(r'\bAVS (1\+?|2\+?|3|4)\b', new))
            changes = orig_avs - new_avs
            total_changes += changes
            print(f'{fn}: {changes} replacements')
            if not dry_run:
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(new)
        else:
            print(f'{fn}: no changes')
    print(f'\nTotal: {total_changes} AVS->AVCP replacements')


if __name__ == '__main__':
    main()
