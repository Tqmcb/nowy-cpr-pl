#!/usr/bin/env bash
# validate-cpr.sh — walidacja merytoryczna treści CPR (UE) 2024/3110
# Uruchom z katalogu projektu lub podaj ścieżkę do src/

set -uo pipefail

SRC="${1:-$(dirname "$0")/../../src}"
ERRORS=0
WARNINGS=0

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RESET='\033[0m'

err()  { echo -e "${RED}[BŁĄD]${RESET} $*"; ERRORS=$((ERRORS + 1)); }
warn() { echo -e "${YELLOW}[UWAGA]${RESET} $*"; WARNINGS=$((WARNINGS + 1)); }
info() { echo -e "${CYAN}[INFO]${RESET}  $*"; }

# Helper: grep-and-report (case-insensitive)
check() {
  local label="$1" pattern="$2" severity="${3:-err}"
  local matches
  matches=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.mdx" --include="*.md" \
    -iE "$pattern" "$SRC" 2>/dev/null || true)
  if [ -n "$matches" ]; then
    "$severity" "$label"
    echo "$matches" | sed 's/^/         /'
    echo ""
  fi
}

echo ""
echo -e "${CYAN}══════════════════════════════════════════════${RESET}"
echo -e "${CYAN}  Walidacja CPR (UE) 2024/3110 — nowycpr.pl  ${RESET}"
echo -e "${CYAN}══════════════════════════════════════════════${RESET}"
echo ""

# ─── 1. ZŁE NUMERY ARTYKUŁÓW ────────────────────────────────────────────────

info "Sprawdzanie numerów artykułów..."
echo ""

# Art. 15-16 → powinno być 18-19 (DoP&C)
check \
  "Art. 15–16 znaleziony — DoP&C to Art. 18–19 w CPR 2024/3110" \
  "art\.?\s*15[-–]16"

# Art. 21 dla pliku technicznego → powinno być Art. 20 (wyklucz art. 21 RODO i URLe)
check_art21() {
  local matches
  matches=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.mdx" --include="*.md" \
    -iE "art\.?\s*21\b" "$SRC" 2>/dev/null | grep -v "RODO" | grep -v "/docs/" || true)
  if [ -n "$matches" ]; then
    warn "Art. 21 znaleziony — plik techniczny to Art. 20 (sprawdź kontekst)"
    echo "$matches" | sed 's/^/         /'
    echo ""
  fi
}
check_art21

# Art. 23 = upoważniony przedstawiciel (poprawny artykuł w CPR 2024/3110)
# Art. 22 = obowiązki producenta (Art. 22 ust. 3 = plik techniczny, Art. 22 ust. 5 = unikalny identyfikator)
# Art. 24 = obowiązki importera, Art. 25 = obowiązki dystrybutora
# Brak sprawdzania Art. 23 — jest poprawny dla upoważnionego przedstawiciela

# Art. 25 dla DPP → powinno być Art. 75–80
# DPP w CPR 2024/3110: Art. 75 (definicja), 76 (zawartość), 77 (dostęp),
# 78 (unikalny identyfikator), 79 (operatorzy), 80 (nadzór rynku)
check_art25_dpp() {
  local matches
  matches=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.mdx" --include="*.md" \
    -iE "art\.?\s*25.{0,40}(DPP|paszport|passport)" "$SRC" 2>/dev/null || true)
  if [ -n "$matches" ]; then
    err "Art. 25 użyty dla DPP — Cyfrowy Paszport Produktu to Art. 75–80 w CPR 2024/3110"
    echo "$matches" | sed 's/^/         /'
    echo ""
  fi
}
check_art25_dpp

# ─── 2. ZAKAZANE SŁOWNICTWO ─────────────────────────────────────────────────

info "Sprawdzanie słownictwa (jednostka certyfikująca)..."
echo ""

# "usługi doradcze"
check \
  "Fraza 'usługi doradcze' — jednostka certyfikująca nie może oferować usług doradczych" \
  "usług[ia]?\s+doradcz|doradcz[ae]\s+usług"

# "doradztwo"
check \
  "'doradztwo' — rozważ zamianę na 'przegląd', 'ocena', 'weryfikacja'" \
  "\bdoradztwo\b" \
  warn

# "wdrożenie" jako tytuł usługi Multicert (wyklucz: blog, timeline, harmonogram)
check_wdrozenie() {
  local matches
  matches=$(grep -rn --include="*.tsx" --include="*.ts" \
    -iE "title.*wdrożenie|\"Wdrożenie\s" "$SRC" 2>/dev/null \
    | grep -v "BlogPage\|blog\|timeline\|year.*20[0-9][0-9]\|Cyfryzacja\|Końcowa" || true)
  if [ -n "$matches" ]; then
    warn "'Wdrożenie' jako tytuł usługi — jednostka certyfikująca nie wdraża (to konsulting)"
    echo "$matches" | sed 's/^/         /'
    echo ""
  fi
}
check_wdrozenie

# "konsulting" / "konsultacje"
check \
  "'konsulting' lub 'konsultacje' — niedozwolone dla jednostki certyfikującej" \
  "\b(konsulting|konsultacje)\b"

# ─── 3. DANE ZASTĘPCZE ──────────────────────────────────────────────────────

info "Sprawdzanie danych zastępczych..."
echo ""

# Placeholder telefon
check \
  "Placeholder numer telefonu — zastąp prawdziwym numerem" \
  "123\s*456\s*789|\+48\s*123"

# Lorem ipsum
check \
  "Lorem ipsum — usuń placeholder text" \
  "lorem\s+ipsum"

# Placeholder email
check \
  "Potencjalny email placeholder" \
  "example@example|test@test|your-email@" \
  warn

# ─── PODSUMOWANIE ───────────────────────────────────────────────────────────

echo -e "${CYAN}══════════════════════════════════════════════${RESET}"
if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo -e "${GREEN}  ✓ Walidacja OK — brak błędów i ostrzeżeń  ${RESET}"
elif [ "$ERRORS" -eq 0 ]; then
  echo -e "${YELLOW}  Ostrzeżenia: $WARNINGS | Błędy krytyczne: 0  ${RESET}"
else
  echo -e "${RED}  Błędy: $ERRORS | Ostrzeżenia: $WARNINGS  ${RESET}"
fi
echo -e "${CYAN}══════════════════════════════════════════════${RESET}"
echo ""

[ "$ERRORS" -eq 0 ] || exit 1
