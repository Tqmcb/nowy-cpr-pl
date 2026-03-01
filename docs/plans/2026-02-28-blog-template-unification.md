# Blog Template Unification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ujednolicić wygląd nagłówka/hero we wszystkich 6 szablonach blogowych — jeden spójny wzorzec (zdjęcie w tle + gradient overlay + tytuł), wszystkie ciemne tła, zero niebieskiego/fioletowego.

**Architecture:** Wyodrębniamy komponent `SharedHero` z konfigurowalnym kolorem akcentu (klasy Tailwind jako string literals). Każdy szablon używa `SharedHero` z własną konfiguracją koloru i ikony, ale ta sama struktura HTML. Zmieniamy `PrzewodnikTemplate` (blue→amber, slate-50→slate-900) i `AktualnosciTemplate` (violet/white→rose/slate-900). Dodajemy brakujący `PraktycznyTemplate` (teal). Dodajemy 3 nowe zestawy komponentów markdown: ORANGE, ROSE, TEAL.

**Tech Stack:** React, TypeScript, Tailwind CSS, ReactMarkdown, lucide-react, Vite

---

## Kontekst

Plik główny: `src/pages/BlogPost.tsx` (1120 linii).

Aktualne zestawy komponentów markdown (linie 38–223):
- `DARK_COMPONENTS` — amber akcenty (używany przez: regulacja, techniczny, default)
- `LIGHT_COMPONENTS` — niebieskie akcenty, jasne tło (używany przez: przewodnik, aktualnosci) → **DO USUNIĘCIA z użycia**
- `EMERALD_COMPONENTS` — szmaragdowe akcenty (używany przez: analiza)

Szablony (linie 358–939):
- `RegulacjaTemplate` (l.361) — slate-950, amber/red, ✅ ma hero z obrazem
- `PrzewodnikTemplate` (l.446) — ❌ slate-50 bg, blue-600 header → **REWRITE**
- `AnalizaTemplate` (l.566) — slate-900, emerald, ✅ ma hero z obrazem
- `TechnicznyTemplate` (l.679) — slate-900, amber, ❌ 2-kolumnowy nagłówek → **UPDATE**
- `AktualnosciTemplate` (l.755) — ❌ white bg, violet → **REWRITE**
- `DefaultTemplate` (l.900) — slate-900, amber, brak hero

Switch (linie 1105–1118): `"praktyczny"` nie istnieje → wpada w `default`.

---

## Task 1: Nowe zestawy komponentów markdown + import CheckSquare

**Files:**
- Modify: `src/pages/BlogPost.tsx:9-13` (import)
- Modify: `src/pages/BlogPost.tsx:223` (po EMERALD_COMPONENTS — dodać 3 nowe)

**Step 1: Dodaj CheckSquare do importu lucide-react (linia 9-13)**

```tsx
import {
  ArrowLeft, Calendar, User, Tag, Clock, Scale, BookOpen,
  BarChart2, Wrench, Newspaper, ChevronRight, FileText, HelpCircle,
  Shield, ExternalLink, CheckSquare,
} from "lucide-react";
```

**Step 2: Dodaj ORANGE_COMPONENTS po EMERALD_COMPONENTS (po linii ~223)**

```tsx
const ORANGE_COMPONENTS: Components = {
  ...DARK_COMPONENTS,
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white mt-8 mb-4 pb-2 border-b border-orange-400/20">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-orange-400 mt-6 mb-3">{children}</h3>
  ),
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-2.5 text-slate-300 text-[15px]">
      {ordered ? (
        <span className="text-orange-400 font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">
          {(index ?? 0) + 1}.
        </span>
      ) : (
        <span className="text-orange-400 mt-2 shrink-0 text-xs">▪</span>
      )}
      <span>{children}</span>
    </li>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-orange-400/60 bg-orange-400/5 pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-slate-400 italic text-[15px]">{children}</div>
    </blockquote>
  ),
  th: ({ children }) => (
    <th className="text-orange-400 font-semibold text-left px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap">
      {children}
    </th>
  ),
  code: ({ children, className }) => {
    if (className) return <code className={`${className} text-orange-300 text-sm font-mono`}>{children}</code>;
    return <code className="bg-slate-700/70 text-orange-400 px-1.5 py-0.5 rounded text-[13px] font-mono border border-white/10">{children}</code>;
  },
};

const ROSE_COMPONENTS: Components = {
  ...DARK_COMPONENTS,
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white mt-8 mb-4 pb-2 border-b border-rose-400/20">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-rose-400 mt-6 mb-3">{children}</h3>
  ),
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-2.5 text-slate-300 text-[15px]">
      {ordered ? (
        <span className="text-rose-400 font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">
          {(index ?? 0) + 1}.
        </span>
      ) : (
        <span className="text-rose-400 mt-2 shrink-0 text-xs">▪</span>
      )}
      <span>{children}</span>
    </li>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-rose-400 hover:text-rose-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-rose-400/60 bg-rose-400/5 pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-slate-400 italic text-[15px]">{children}</div>
    </blockquote>
  ),
  th: ({ children }) => (
    <th className="text-rose-400 font-semibold text-left px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap">
      {children}
    </th>
  ),
  code: ({ children, className }) => {
    if (className) return <code className={`${className} text-rose-300 text-sm font-mono`}>{children}</code>;
    return <code className="bg-slate-700/70 text-rose-400 px-1.5 py-0.5 rounded text-[13px] font-mono border border-white/10">{children}</code>;
  },
};

const TEAL_COMPONENTS: Components = {
  ...DARK_COMPONENTS,
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white mt-8 mb-4 pb-2 border-b border-teal-400/20">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-teal-400 mt-6 mb-3">{children}</h3>
  ),
  li: ({ children, ordered, index }) => (
    <li className="flex items-start gap-2.5 text-slate-300 text-[15px]">
      {ordered ? (
        <span className="text-teal-400 font-bold mt-0.5 min-w-[1.4rem] text-sm shrink-0">
          {(index ?? 0) + 1}.
        </span>
      ) : (
        <span className="text-teal-400 mt-2 shrink-0 text-xs">▪</span>
      )}
      <span>{children}</span>
    </li>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-teal-400/60 bg-teal-400/5 pl-5 py-3 my-5 rounded-r-lg">
      <div className="text-slate-400 italic text-[15px]">{children}</div>
    </blockquote>
  ),
  th: ({ children }) => (
    <th className="text-teal-400 font-semibold text-left px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap">
      {children}
    </th>
  ),
  code: ({ children, className }) => {
    if (className) return <code className={`${className} text-teal-300 text-sm font-mono`}>{children}</code>;
    return <code className="bg-slate-700/70 text-teal-400 px-1.5 py-0.5 rounded text-[13px] font-mono border border-white/10">{children}</code>;
  },
};
```

**Step 3: Sprawdź typy TypeScript**

```bash
cd /Users/admin/Downloads/nowy-cpr-pl && npx tsc --noEmit 2>&1 | head -30
```
Oczekiwane: brak błędów (lub tylko pre-istniejące).

**Step 4: Commit**

```bash
git add src/pages/BlogPost.tsx
git commit -m "feat: dodaj ORANGE, ROSE, TEAL markdown components + CheckSquare import"
```

---

## Task 2: Komponent SharedHero

**Files:**
- Modify: `src/pages/BlogPost.tsx` — dodać przed linią `// TEMPLATE 1: REGULACJA`

**Step 1: Dodaj type HeroConfig i komponent SharedHero**

Wstaw poniższy kod bezpośrednio przed komentarzem `// ─── TEMPLATE 1: REGULACJA`:

```tsx
// ────────────────────────────────────────────────────────────────────────────
// SHARED HERO — jednolity nagłówek/hero dla wszystkich szablonów
// Struktura: zdjęcie w tle (opacity-15) + gradient overlay + badge + tytuł + meta
// ────────────────────────────────────────────────────────────────────────────

type HeroConfig = {
  /** Pełne klasy Tailwind dla badge'a — muszą być literalami (Tailwind purging) */
  badgeClasses: string;
  /** Klasa koloru dla ikon w meta (User, Calendar, Clock) np. "text-amber-400" */
  iconAccentClass: string;
  /** Klasa hover dla przycisku "Powrót do bloga" np. "hover:text-amber-400" */
  buttonHoverClass: string;
  /** Etykieta badge'a np. "Regulacja", "Przewodnik" */
  badgeLabel: string;
  /** Ikona lucide-react do badge'a */
  BadgeIcon: React.ComponentType<{ className?: string }>;
  /** Kolor końcowy gradientu overlay (dopasuj do bg strony) — domyślnie "to-slate-900" */
  bottomBg?: string;
};

function SharedHero({
  post,
  navigate,
  config,
}: {
  post: BlogPostType;
  navigate: (p: string) => void;
  config: HeroConfig;
}) {
  const {
    badgeClasses,
    iconAccentClass,
    buttonHoverClass,
    badgeLabel,
    BadgeIcon,
    bottomBg = "to-slate-900",
  } = config;

  return (
    <div className="relative overflow-hidden">
      {post.image_url && (
        <div className="absolute inset-0">
          <img
            src={post.image_url}
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/90 ${bottomBg}`}
          />
        </div>
      )}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <button
          onClick={() => navigate("/blog")}
          className={`flex items-center gap-2 text-slate-400 ${buttonHoverClass} transition-colors mb-8 group text-sm`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Powrót do bloga
        </button>
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClasses}`}
          >
            <BadgeIcon className="w-3 h-3" /> {badgeLabel}
          </span>
          {post.category && (
            <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
          {post.title}
        </h1>
        <p className="text-slate-400 mt-4 text-sm flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <User className={`w-3.5 h-3.5 ${iconAccentClass}`} />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className={`w-3.5 h-3.5 ${iconAccentClass}`} />
            {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${iconAccentClass}`} />
            ok. {readingTime(post.content)} min czytania
          </span>
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Sprawdź typy**

```bash
npx tsc --noEmit 2>&1 | head -20
```

**Step 3: Commit**

```bash
git add src/pages/BlogPost.tsx
git commit -m "feat: SharedHero — ujednolicony nagłówek dla wszystkich szablonów blogowych"
```

---

## Task 3: RegulacjaTemplate → SharedHero

**Files:**
- Modify: `src/pages/BlogPost.tsx:361-440` (RegulacjaTemplate)

**Step 1: Zastąp istniejący blok hero w RegulacjaTemplate**

Znajdź w `RegulacjaTemplate` sekcję `{/* Hero */}` (linie ~373-408) i zastąp ją wywołaniem `SharedHero`:

```tsx
// USUŃ cały blok:
// {/* Hero */}
// <div className="relative overflow-hidden">
//   ...
// </div>

// DODAJ:
<SharedHero
  post={post}
  navigate={navigate}
  config={{
    badgeClasses: "bg-red-500/15 border border-red-500/30 text-red-400",
    iconAccentClass: "text-amber-400",
    buttonHoverClass: "hover:text-amber-400",
    badgeLabel: "Regulacja",
    BadgeIcon: Scale,
    bottomBg: "to-slate-950",
  }}
/>
```

Pełny `RegulacjaTemplate` po zmianie:

```tsx
function RegulacjaTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  const KEY_DATES = [
    { date: "7 sty 2025", label: "Wejście w życie CPR 2024/3110" },
    { date: "8 sty 2026", label: "Pełne stosowanie rozporządzenia" },
    { date: "8 sty 2027", label: "Sankcje (Art. 92) zaczną obowiązywać" },
    { date: "9 sty 2031", label: "Wygasają stare EAD" },
    { date: "7 sty 2040", label: "Koniec okresu przejściowego" },
  ];
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-red-500/15 border border-red-500/30 text-red-400",
            iconAccentClass: "text-amber-400",
            buttonHoverClass: "hover:text-amber-400",
            badgeLabel: "Regulacja",
            BadgeIcon: Scale,
            bottomBg: "to-slate-950",
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={DARK_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" /> Harmonogram
                </h4>
                <ol className="space-y-3">
                  {KEY_DATES.map((item) => (
                    <li key={item.date} className="flex items-start gap-3">
                      <span className="text-amber-400 font-mono text-xs font-bold mt-0.5 shrink-0">{item.date}</span>
                      <span className="text-slate-400 text-xs">{item.label}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

**Step 2: Sprawdź typy**

```bash
npx tsc --noEmit 2>&1 | head -20
```

**Step 3: Commit**

```bash
git add src/pages/BlogPost.tsx
git commit -m "refactor: RegulacjaTemplate — używa SharedHero"
```

---

## Task 4: AnalizaTemplate → SharedHero

**Files:**
- Modify: `src/pages/BlogPost.tsx:566-673` (AnalizaTemplate)

**Step 1: Zastąp istniejący blok hero w AnalizaTemplate**

Analogicznie jak w Task 3. Pełny `AnalizaTemplate` po zmianie:

```tsx
function AnalizaTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-emerald-400/15 border border-emerald-400/30 text-emerald-400",
            iconAccentClass: "text-emerald-400",
            buttonHoverClass: "hover:text-emerald-400",
            badgeLabel: "Analiza",
            BadgeIcon: BarChart2,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={EMERALD_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Informacje</h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Autor</dt>
                    <dd className="text-slate-300 text-sm flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-emerald-400" />{post.author}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Opublikowano</dt>
                    <dd className="text-slate-300 text-sm flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />{formatDate(post.published_at)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Czas czytania</dt>
                    <dd className="text-slate-300 text-sm flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />ok. {readingTime(post.content)} min
                    </dd>
                  </div>
                </dl>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" /> Tagi
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-gradient-to-br from-emerald-400/10 to-teal-500/10 border border-emerald-400/20 rounded-2xl p-5">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400" /> Potrzebujesz pomocy?
                </h4>
                <p className="text-slate-400 text-sm mb-4">Przeprowadzimy analizę i doradzimy odpowiednie rozwiązanie.</p>
                <button
                  onClick={() => navigate("/services")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-400 text-slate-900 font-semibold rounded-xl hover:bg-emerald-300 transition-colors text-sm"
                >
                  Kontakt <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <MulticertBoxDark />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

**Step 2: Sprawdź typy + commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add src/pages/BlogPost.tsx
git commit -m "refactor: AnalizaTemplate — używa SharedHero"
```

---

## Task 5: PrzewodnikTemplate → ciemny motyw + SharedHero

**Files:**
- Modify: `src/pages/BlogPost.tsx:446-560` (PrzewodnikTemplate) — **PEŁNY REWRITE**

**Step 1: Zastąp całą funkcję PrzewodnikTemplate**

```tsx
function PrzewodnikTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-amber-400/15 border border-amber-400/30 text-amber-400",
            iconAccentClass: "text-amber-400",
            buttonHoverClass: "hover:text-amber-400",
            badgeLabel: "Przewodnik",
            BadgeIcon: BookOpen,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={DARK_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              {/* TL;DR — streszczenie posta */}
              {post.excerpt && (
                <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-5">
                  <h4 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> TL;DR
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
              )}
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

**Step 2: Sprawdź typy**

```bash
npx tsc --noEmit 2>&1 | head -20
```

**Step 3: Commit**

```bash
git add src/pages/BlogPost.tsx
git commit -m "refactor: PrzewodnikTemplate — ciemny motyw amber, SharedHero, usunięto blue"
```

---

## Task 6: TechnicznyTemplate → SharedHero + ORANGE_COMPONENTS

**Files:**
- Modify: `src/pages/BlogPost.tsx:679-749` (TechnicznyTemplate) — **PEŁNY REWRITE**

**Step 1: Zastąp całą funkcję TechnicznyTemplate**

```tsx
function TechnicznyTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-orange-400/15 border border-orange-400/30 text-orange-400",
            iconAccentClass: "text-orange-400",
            buttonHoverClass: "hover:text-orange-400",
            badgeLabel: "Techniczny",
            BadgeIcon: Wrench,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={ORANGE_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              <div className="bg-orange-400/5 border border-orange-400/20 rounded-2xl p-5">
                <h4 className="text-orange-400 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Normy i wymagania
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Artykuł dotyczy wyrobów budowlanych objętych normami zharmonizowanymi na mocy CPR 2024/3110.
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-orange-400/10 text-orange-300 border border-orange-400/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

**Step 2: Sprawdź typy + commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add src/pages/BlogPost.tsx
git commit -m "refactor: TechnicznyTemplate — SharedHero, orange akcenty, ORANGE_COMPONENTS"
```

---

## Task 7: AktualnosciTemplate → ciemny motyw + SharedHero + ROSE_COMPONENTS

**Files:**
- Modify: `src/pages/BlogPost.tsx:755-894` (AktualnosciTemplate) — **PEŁNY REWRITE**

**Step 1: Zastąp całą funkcję AktualnosciTemplate**

```tsx
function AktualnosciTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-rose-400/15 border border-rose-400/30 text-rose-400",
            iconAccentClass: "text-rose-400",
            buttonHoverClass: "hover:text-rose-400",
            badgeLabel: "Aktualności",
            BadgeIcon: Newspaper,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={ROSE_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              {/* Co musisz wiedzieć */}
              {post.excerpt && (
                <div className="bg-rose-400/5 border border-rose-400/20 rounded-2xl p-5">
                  <h4 className="text-rose-400 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Newspaper className="w-4 h-4" /> Co musisz wiedzieć
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
              )}
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

**Step 2: Sprawdź typy + commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add src/pages/BlogPost.tsx
git commit -m "refactor: AktualnosciTemplate — ciemny motyw rose, SharedHero, usunięto white/violet"
```

---

## Task 8: Nowy PraktycznyTemplate + case w switch

**Files:**
- Modify: `src/pages/BlogPost.tsx:896-939` (po DefaultTemplate, przed LoadingSkeleton)
- Modify: `src/pages/BlogPost.tsx:1105-1118` (switch statement)

**Step 1: Dodaj PraktycznyTemplate po DefaultTemplate (przed LoadingSkeleton)**

```tsx
// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE 6: PRAKTYCZNY — dark teal, action-oriented, checklist sidebar
// ────────────────────────────────────────────────────────────────────────────

function PraktycznyTemplate({ post, navigate }: { post: BlogPostType; navigate: (p: string) => void }) {
  const CHECKLIST = [
    "Sprawdź wymagania CPR dla swojego wyrobu",
    "Zidentyfikuj właściwy system AVS",
    "Skontaktuj się z jednostką notyfikowaną",
    "Przygotuj dokumentację techniczną",
    "Wystaw Deklarację Właściwości Użytkowych (DoP&C)",
    "Umieść oznakowanie CE na wyrobie",
  ];
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <SharedHero
          post={post}
          navigate={navigate}
          config={{
            badgeClasses: "bg-teal-400/15 border border-teal-400/30 text-teal-400",
            iconAccentClass: "text-teal-400",
            buttonHoverClass: "hover:text-teal-400",
            badgeLabel: "Praktyczny",
            BadgeIcon: CheckSquare,
          }}
        />
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={TEAL_COMPONENTS}>
                {post.content}
              </ReactMarkdown>
            </article>
            <aside className="space-y-5">
              {/* Lista kontrolna */}
              <div className="bg-teal-400/5 border border-teal-400/20 rounded-2xl p-5">
                <h4 className="text-teal-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" /> Lista kontrolna
                </h4>
                <ol className="space-y-2.5">
                  {CHECKLIST.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-teal-400 font-mono text-xs font-bold mt-0.5 shrink-0">{i + 1}.</span>
                      <span className="text-slate-400 text-xs leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <DarkSidebarMeta post={post} navigate={navigate} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

**Step 2: Dodaj case "praktyczny" w switch (linia ~1113)**

```tsx
switch (post.template) {
  case "regulacja":
    return <>{seoHelmet}<RegulacjaTemplate post={post} navigate={navigate} /></>;
  case "przewodnik":
    return <>{seoHelmet}<PrzewodnikTemplate post={post} navigate={navigate} /></>;
  case "analiza":
    return <>{seoHelmet}<AnalizaTemplate post={post} navigate={navigate} /></>;
  case "techniczny":
    return <>{seoHelmet}<TechnicznyTemplate post={post} navigate={navigate} /></>;
  case "aktualnosci":
    return <>{seoHelmet}<AktualnosciTemplate post={post} navigate={navigate} /></>;
  case "praktyczny":
    return <>{seoHelmet}<PraktycznyTemplate post={post} navigate={navigate} /></>;
  default:
    return <>{seoHelmet}<DefaultTemplate post={post} navigate={navigate} /></>;
}
```

**Step 3: Sprawdź typy + commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add src/pages/BlogPost.tsx
git commit -m "feat: PraktycznyTemplate — nowy szablon teal z listą kontrolną"
```

---

## Task 9: Porządkowanie kategorii w 40 plikach .md

**Files:**
- Modify: wszystkie pliki w `content/blog/*.md`

**Tabela mapowania:**

| Stara kategoria | Nowa kategoria |
|---|---|
| `Poradnik` | `Certyfikacja` |
| `Produkcja` | `Certyfikacja` |
| `Dokumentacja` | `Certyfikacja` |
| `Normy` | `Certyfikacja` |
| `Bezpieczeństwo` | `Certyfikacja` |
| `Wymagania` | `Prawo` |
| `Nadzór rynku` | `Prawo` |
| `Handel` | `Prawo` |
| `Analiza` | `Środowisko` |
| `Przepisy` | `Aktualności` |
| `Digital DoP` | `Cyfryzacja` |

**Step 1: Wykonaj zamiany sed (działaj z katalogu projektu)**

```bash
cd /Users/admin/Downloads/nowy-cpr-pl
sed -i '' 's/^category: "Poradnik"/category: "Certyfikacja"/' content/blog/*.md
sed -i '' 's/^category: "Produkcja"/category: "Certyfikacja"/' content/blog/*.md
sed -i '' 's/^category: "Dokumentacja"/category: "Certyfikacja"/' content/blog/*.md
sed -i '' 's/^category: "Normy"/category: "Certyfikacja"/' content/blog/*.md
sed -i '' "s/^category: \"Bezpieczeństwo\"/category: \"Certyfikacja\"/" content/blog/*.md
sed -i '' 's/^category: "Wymagania"/category: "Prawo"/' content/blog/*.md
sed -i '' "s/^category: \"Nadzór rynku\"/category: \"Prawo\"/" content/blog/*.md
sed -i '' 's/^category: "Handel"/category: "Prawo"/' content/blog/*.md
sed -i '' 's/^category: "Analiza"/category: "Środowisko"/' content/blog/*.md
sed -i '' "s/^category: \"Przepisy\"/category: \"Aktualności\"/" content/blog/*.md
sed -i '' 's/^category: "Digital DoP"/category: "Cyfryzacja"/' content/blog/*.md
```

**Step 2: Zweryfikuj wynik — powinno być 6 unikalnych wartości**

```bash
grep "^category:" content/blog/*.md | sed 's/.*category: //' | sort | uniq -c | sort -rn
```

Oczekiwany wynik (6 kategorii):
```
16 "Certyfikacja"
 9 "Prawo"
 6 "Środowisko"
 4 "Cyfryzacja"
 3 "Materiały"
 2 "Aktualności"
```

**Step 3: Commit**

```bash
git add content/blog/
git commit -m "fix: kategorie blogowe — 17 chaotycznych → 6 kanonicznych"
```

---

## Task 10: Build + weryfikacja końcowa

**Step 1: Build produkcyjny**

```bash
cd /Users/admin/Downloads/nowy-cpr-pl && npm run build 2>&1
```

Oczekiwane: `✓ built in X.XXs`, brak błędów TypeScript/Vite.

**Step 2: Sprawdź dist/**

```bash
ls dist/docs/ | head -20
ls dist/assets/*.js | wc -l
```

**Step 3: Commit dist/ (jeśli śledzony przez git)**

```bash
git add dist/
git commit -m "build: aktualizacja dist — unifikacja szablonów blogowych"
```

**Step 4: Push**

```bash
git push origin main
```

---

## Podsumowanie zmian

| Plik | Zmiana |
|---|---|
| `src/pages/BlogPost.tsx` | +3 komponenty markdown (ORANGE, ROSE, TEAL), SharedHero, PraktycznyTemplate, 3 pełne rewrite szablonów, 2 refaktoryzacje |
| `content/blog/*.md` (11 plików) | Zmiana category w frontmatterze |

**Paleta końcowa:**
| Szablon | Tło | Akcent |
|---|---|---|
| `regulacja` | slate-950 | amber + red badge |
| `przewodnik` | slate-900 | amber |
| `analiza` | slate-900 | emerald |
| `techniczny` | slate-900 | orange |
| `aktualnosci` | slate-900 | rose |
| `praktyczny` | slate-900 | teal |
