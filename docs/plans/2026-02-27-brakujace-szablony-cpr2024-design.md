# Design: Brakujące szablony dokumentów CPR 2024/3110

**Data:** 2026-02-27
**Status:** Zatwierdzone przez użytkownika

## Kontekst

Strona NowyCPR.pl posiada 8 szablonów HTML w `/public/docs/`. Analiza wykazała 4 brakujące dokumenty wymagane przez CPR 2024/3110, niezbędne dla importerów, dystrybutorów i producentów.

## Dokumenty do stworzenia

| ID | Plik HTML | Podstawa prawna | Priorytet |
|---|---|---|---|
| `importer-dopc` | `importer-dopc-szablon.html` | Art. 16 ust. 3-4, Art. 17 | 🔴 Wysoki |
| `tech-file` | `dokumentacja-techniczna-art21.html` | Art. 21 | 🟡 Średni |
| `user-instructions` | `instrukcja-uzytkownika-art25.html` | Art. 25 | 🟡 Średni |
| `auth-rep-mandate` | `mandat-przedstawiciela-art23.html` | Art. 23 | 🟢 Niski |

## Struktura każdego dokumentu HTML

- Nagłówek: tytuł + numer artykułu CPR 2024/3110
- Sekcje z polami do wypełnienia (linie, pola tekstowe)
- Adnotacja edukacyjna (wzór — dostosuj przed użyciem)
- Stopka: NowyCPR.pl | Multicert Sp. z o.o. | PCA AC 210
- CSS print-ready (Ctrl+P → PDF)
- Styl spójny z istniejącymi 8 szablonami

## Zmiany w kodzie

### `/public/docs/` — 4 nowe pliki HTML

### `/src/utils/documentHelpers.ts`
Dodać 4 wpisy do tablicy `documents[]` i mapowania `documentUrls`.

### `/src/components/DocumentsPage.tsx`
Brak zmian — komponenty `Document` i modal działają generycznie.

## Treść merytoryczna

### importer-dopc-szablon.html (Art. 16 ust. 3-4, Art. 17)
- Dane importera (nazwa, adres, kraj UE)
- Dane oryginalnego producenta spoza UE
- Wyrób i jego identyfikacja
- Oświadczenie importera o przejęciu odpowiedzialności
- Deklarowane właściwości (jak w DoPC producenta)
- SVHC (Art. 15 ust. 6)
- Podpis i data

### dokumentacja-techniczna-art21.html (Art. 21)
- Lista dokumentów składających się na plik techniczny
- Opis wyrobu i jego zamierzone zastosowanie
- Wykaz norm/ETA
- Wyniki badań i obliczeń
- Certyfikaty i sprawozdania jednostki notyfikowanej
- Dokumentacja FPC
- Oświadczenie o kompletności (10-letnie przechowywanie)

### instrukcja-uzytkownika-art25.html (Art. 25)
- Dane producenta
- Opis wyrobu i zastosowania
- Instrukcje montażu/instalacji
- Wymagania bezpieczeństwa
- Warunki przechowywania i transportu
- Informacje środowiskowe
- Dane kontaktowe

### mandat-przedstawiciela-art23.html (Art. 23)
- Dane producenta (spoza UE)
- Dane upoważnionego przedstawiciela (w UE)
- Zakres upoważnienia (lista obowiązków)
- Czas obowiązywania mandatu
- Podpisy obu stron
