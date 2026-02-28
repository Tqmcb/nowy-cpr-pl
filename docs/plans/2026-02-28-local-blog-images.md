# Local Blog Images Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Zastąpić wszystkie zewnętrzne URL Unsplash lokalnie hostowanymi obrazami pogrupowanymi per-kategoria, eliminując rate-limiting i brakujące/nieadekwatne zdjęcia.

**Architecture:** Pobieramy 6 obrazów z Pexels (darmowa licencja CC0) do `public/images/blog/`, po jednym na kategorię blogową. Wszystkie 41 plików `.md` i komponenty React dostają lokalne ścieżki `/images/blog/{kategoria}.jpg`.

**Tech Stack:** curl (download), sed/bash (batch frontmatter update), Vite (static asset serving from public/)

---

## Kategorie → obrazy

| Kategoria | Plik | Temat szukany |
|-----------|------|---------------|
| Certyfikacja | `certyfikacja.jpg` | quality testing lab / CE mark inspection |
| Prawo | `prawo.jpg` | legal documents / EU law / regulation |
| Środowisko | `srodowisko.jpg` | green building / sustainability / EPD |
| Cyfryzacja | `cyfryzacja.jpg` | digital technology / QR code / computer |
| Materiały | `materialy.jpg` | concrete / building materials / bricks |
| Aktualności | `aktualnosci.jpg` | news / business meeting / calendar |

---

### Task 1: Utwórz katalog i pobierz obrazy z Pexels

**Files:**
- Create dir: `public/images/blog/`

**Step 1: Utwórz katalog**

```bash
mkdir -p public/images/blog
```

**Step 2: Pobierz 6 obrazów przez curl**

Pexels CDN — bezpośrednie linki (CC0, brak klucza API do pobrania):

```bash
# Certyfikacja — inspekcja jakości / laboratorium
curl -L "https://images.pexels.com/photos/3862133/pexels-photo-3862133.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1" \
  -o public/images/blog/certyfikacja.jpg

# Prawo — dokumenty prawne / przepisy
curl -L "https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1" \
  -o public/images/blog/prawo.jpg

# Środowisko — zrównoważone budownictwo / zieleń
curl -L "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1" \
  -o public/images/blog/srodowisko.jpg

# Cyfryzacja — technologia cyfrowa
curl -L "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1" \
  -o public/images/blog/cyfryzacja.jpg

# Materiały — materiały budowlane / beton
curl -L "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1" \
  -o public/images/blog/materialy.jpg

# Aktualności — biznes / spotkanie / aktualności
curl -L "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=1" \
  -o public/images/blog/aktualnosci.jpg
```

**Step 3: Sprawdź pobrane pliki**

```bash
ls -lh public/images/blog/
```

Oczekiwane: 6 plików .jpg, każdy > 50KB.

Jeśli któryś plik jest < 10KB (błędny download), podmień ID z backupowej listy:
```
Certyfikacja backup: 3862132, 1216589, 3184418
Prawo backup: 289667, 906494, 7876767
Środowisko backup: 1108069, 2219024, 1108572
Cyfryzacja backup: 1181271, 3861976, 60504
Materiały backup: 1117452, 159306, 2097
Aktualności backup: 3182773, 3183197, 1181671
```

**Step 4: Commit**

```bash
git add public/images/blog/
git commit -m "feat: dodano lokalne zdjęcia blogowe per-kategoria (Pexels CC0)"
```

---

### Task 2: Zaktualizuj frontmatter w plikach markdown

**Files:**
- Modify: `content/blog/*.md` (41 plików) — pole `image_url`

**Step 1: Podmień image_url per-kategoria jednym skryptem bash**

```bash
# Certyfikacja
for f in $(grep -rl '"Certyfikacja"' content/blog/); do
  sed -i '' 's|image_url: "https://.*"|image_url: "/images/blog/certyfikacja.jpg"|' "$f"
done

# Prawo
for f in $(grep -rl '"Prawo"' content/blog/); do
  sed -i '' 's|image_url: "https://.*"|image_url: "/images/blog/prawo.jpg"|' "$f"
done

# Środowisko
for f in $(grep -rl '"Środowisko"' content/blog/); do
  sed -i '' 's|image_url: "https://.*"|image_url: "/images/blog/srodowisko.jpg"|' "$f"
done

# Cyfryzacja
for f in $(grep -rl '"Cyfryzacja"' content/blog/); do
  sed -i '' 's|image_url: "https://.*"|image_url: "/images/blog/cyfryzacja.jpg"|' "$f"
done

# Materiały
for f in $(grep -rl '"Materiały"' content/blog/); do
  sed -i '' 's|image_url: "https://.*"|image_url: "/images/blog/materialy.jpg"|' "$f"
done

# Aktualności
for f in $(grep -rl '"Aktualności"' content/blog/); do
  sed -i '' 's|image_url: "https://.*"|image_url: "/images/blog/aktualnosci.jpg"|' "$f"
done
```

**Step 2: Weryfikacja — żaden .md nie powinien już mieć unsplash**

```bash
grep -r "unsplash" content/blog/ | wc -l
# Oczekiwane: 0
```

**Step 3: Sprawdź że każdy plik ma lokalną ścieżkę**

```bash
grep "image_url" content/blog/*.md | head -10
# Oczekiwane: image_url: "/images/blog/certyfikacja.jpg" (lub inna)
```

**Step 4: Commit**

```bash
git add content/blog/
git commit -m "feat: aktualizacja image_url w 41 postach → lokalne zdjęcia"
```

---

### Task 3: Zaktualizuj fallbackPosts w BlogPage.tsx

**Files:**
- Modify: `src/components/BlogPage.tsx` — tablica `fallbackPosts` (linie ~146-750)

**Step 1: Podmień wszystkie Unsplash URL w fallbackPosts**

Każdy wpis w `fallbackPosts` ma pole `image_url`. Przypisz wg kategorii:
- `"Przewodniki"` → `/images/blog/certyfikacja.jpg` (fallback — brak tej kategorii w md)
- `"Certyfikacja"` → `/images/blog/certyfikacja.jpg`
- `"Prawo"` → `/images/blog/prawo.jpg`
- `"Środowisko"` → `/images/blog/srodowisko.jpg`
- `"Cyfryzacja"` → `/images/blog/cyfryzacja.jpg`
- `"Materiały"` → `/images/blog/materialy.jpg`
- `"Aktualności"` → `/images/blog/aktualnosci.jpg`

Zastąp ręcznie lub skryptem:

```bash
# Podmień wszystkie Unsplash URL w BlogPage.tsx na certyfikacja.jpg jako domyślny
# (doprecyzujemy ręcznie wg kategorii w kodzie)
sed -i '' 's|image_url: "https://images\.unsplash\.com/[^"]*"|image_url: "/images/blog/certyfikacja.jpg"|g' \
  src/components/BlogPage.tsx
```

Następnie dla wpisów z inną kategorią — otwórz plik i dopasuj ręcznie:
```
"Cyfrowa Deklaracja" → cyfryzacja.jpg
"Import" → prawo.jpg
"Jednostki notyfikowane" → certyfikacja.jpg
itd.
```

**Step 2: Weryfikacja**

```bash
grep "unsplash" src/components/BlogPage.tsx | wc -l
# Oczekiwane: 0
```

**Step 3: Commit**

```bash
git add src/components/BlogPage.tsx
git commit -m "fix: podmiana Unsplash → lokalne zdjęcia w fallbackPosts"
```

---

### Task 4: Zaktualizuj hero w ServicesPage.tsx

**Files:**
- Modify: `src/components/ServicesPage.tsx:106`

**Step 1: Podmień jedną linię**

Obecna linia (106):
```tsx
src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3"
```

Zmień na istniejący lokalny obraz:
```tsx
src="/images/hero-construction.jpg"
```

(Plik `public/images/hero-construction.jpg` już istnieje.)

**Step 2: Weryfikacja**

```bash
grep "unsplash" src/components/ServicesPage.tsx | wc -l
# Oczekiwane: 0
```

**Step 3: Commit**

```bash
git add src/components/ServicesPage.tsx
git commit -m "fix: hero ServicesPage → lokalny obraz hero-construction.jpg"
```

---

### Task 5: Build + weryfikacja + deploy

**Step 1: Build**

```bash
npm run build
# Oczekiwane: ✓ built in X.XXs — brak błędów
```

**Step 2: Sprawdź czy obrazy są w dist/**

```bash
ls dist/images/blog/
# Oczekiwane: 6 plików .jpg
```

**Step 3: Commit dist (jeśli wymagane przez deploy)**

```bash
git add dist/
git commit -m "build: aktualizacja dist — lokalne zdjęcia blogowe"
```

**Step 4: Push i deploy**

```bash
git push
# GitHub Actions uruchomi deploy.yml automatycznie
```

**Step 5: Weryfikacja finalna**

```bash
gh run watch
# Oczekiwane: ✓ Deploy to GitHub Pages
```
