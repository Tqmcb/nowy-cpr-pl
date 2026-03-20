# WOW Effects Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dodaj efekty animacyjne "wow" do całego portalu — scroll reveal, animowane liczniki, hover efekty kart, blueprint pulse w hero, scroll progress bar i page transitions — styl: profesjonalny + techniczny (blueprint/wiśniowy akcent).

**Architecture:** Custom hook `useReveal` (IntersectionObserver, zero lib) + hook `useCountUp` (vanilla JS timer). CSS keyframes dla reveal, pulse, progress. Wrapper `<PageTransition>` dla route transitions. Wszystko tree-shakeable, brak nowych npm paczek.

**Tech Stack:** React hooks, IntersectionObserver API, CSS `@keyframes`, Tailwind CSS, React Router `<Outlet>` wrapper.

---

## Chunk 1: Hooks i CSS utilities

### Task 1: Hook `useReveal`

**Files:**
- Create: `src/hooks/useReveal.ts`
- Modify: `src/index.css` (dodaj `.reveal` i `.revealed` klasy)

- [ ] **Step 1: Utwórz `src/hooks/useReveal.ts`**

```ts
import { useEffect, useRef } from "react";

/**
 * Zwraca ref — podepnij do kontenera.
 * Gdy element wejdzie w viewport, otrzyma klasę "revealed".
 * CSS: .reveal { opacity:0; transform:translateY(20px); transition:... }
 *       .revealed { opacity:1; transform:none }
 */
export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
```

- [ ] **Step 2: Dodaj klasy CSS do `src/index.css`** (w bloku `@layer utilities`)

```css
  /* Scroll reveal */
  .reveal {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .revealed {
    opacity: 1;
    transform: none;
  }
  /* Stagger dla kart w gridzie — ustaw --i jako style inline */
  .reveal-stagger {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    transition-delay: calc(var(--i, 0) * 80ms);
  }
  .reveal-stagger.revealed {
    opacity: 1;
    transform: none;
  }
```

- [ ] **Step 3: Sprawdź że `src/hooks/` istnieje i importy się kompilują**

```bash
npm run build 2>&1 | tail -5
```
Expected: `✓ built in`

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useReveal.ts src/index.css
git commit -m "feat: hook useReveal + CSS reveal/reveal-stagger klasy"
```

---

### Task 2: Hook `useCountUp`

**Files:**
- Create: `src/hooks/useCountUp.ts`

- [ ] **Step 1: Utwórz `src/hooks/useCountUp.ts`**

```ts
import { useEffect, useRef, useState } from "react";

/**
 * Animuje liczbę od 0 do `target` przez `duration` ms.
 * Uruchamia się gdy element z `triggerRef` wejdzie w viewport.
 * Zwraca { count, triggerRef }.
 */
export function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const triggerRef = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.unobserve(el);
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, triggerRef };
}
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCountUp.ts
git commit -m "feat: hook useCountUp — animowany licznik na scroll"
```

---

### Task 3: Scroll progress bar

**Files:**
- Create: `src/components/ScrollProgressBar.tsx`
- Modify: `src/components/Header.tsx` (dodaj komponent pod headerem)

- [ ] **Step 1: Utwórz `src/components/ScrollProgressBar.tsx`**

```tsx
import { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-[72px] left-0 right-0 z-40 h-[3px] pointer-events-none"
      aria-hidden
    >
      <div
        className="h-full transition-[width] duration-75"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(to right, #8b1a3c, #1a56a0)",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Dodaj do `src/components/Header.tsx`**

Znajdź koniec `<header>` w Header.tsx i dodaj `<ScrollProgressBar />` bezpośrednio po `</header>`:

```tsx
import { ScrollProgressBar } from "./ScrollProgressBar";
// ...
return (
  <>
    <header ...>
      {/* istniejący kod */}
    </header>
    <ScrollProgressBar />
  </>
);
```

- [ ] **Step 3: Sprawdź że header ma `top-0 fixed` (scroll bar zaczyna się od 72px)**

```bash
grep -n "fixed\|sticky\|h-\[" src/components/Header.tsx | head -10
```
Jeśli header ma inną wysokość niż 72px — zmień `top-[72px]` w ScrollProgressBar.

- [ ] **Step 4: Build + preview**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ScrollProgressBar.tsx src/components/Header.tsx
git commit -m "feat: scroll progress bar — wisnia→niebieski gradient pod headerem"
```

---

## Chunk 2: Animacje na homepage

### Task 4: Animowane liczniki na homepage

**Files:**
- Modify: `src/pages/App.tsx`

- [ ] **Step 1: Import `useCountUp` w App.tsx**

```tsx
import { useCountUp } from "../hooks/useCountUp";
```

- [ ] **Step 2: Dodaj animacje do statystyk**

W `HomePage` znajdź sekcję stats (linie ~138-150):
```tsx
{ value: "2026", label: "Rok stosowania", icon: Calendar },
{ value: "27", label: "Krajów UE", icon: Users },
{ value: "2028+", label: "Realne GWP / DPP", icon: TrendingUp }
```

Zamień na dedykowane komponenty z countUp:
```tsx
function StatCounter({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  // Wyodrębnij liczbę z value, zachowaj prefix/suffix
  const num = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/^\d+/, ""); // np. "+" w "2028+"
  const { count, triggerRef } = useCountUp(num, 1400);
  return (
    <div ref={triggerRef as React.RefObject<HTMLDivElement>} className="text-center">
      <Icon className="w-5 h-5 mx-auto mb-2 text-white/70" />
      <div className="text-2xl md:text-3xl font-bold text-white">
        {count}{suffix}
      </div>
      <div className="text-sm text-white/70 mt-1">{label}</div>
    </div>
  );
}
```

Podmień mapowanie statystyk:
```tsx
<div className="mt-12 grid grid-cols-3 gap-6">
  {[
    { value: "2026", label: "Rok stosowania", icon: Calendar },
    { value: "27", label: "Krajów UE", icon: Users },
    { value: "2028+", label: "Realne GWP / DPP", icon: TrendingUp }
  ].map((stat, idx) => (
    <StatCounter key={idx} {...stat} />
  ))}
</div>
```

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/App.tsx src/hooks/useCountUp.ts
git commit -m "feat: animowane liczniki na homepage — countUp na scroll"
```

---

### Task 5: Scroll reveal na sekcjach homepage

**Files:**
- Modify: `src/pages/App.tsx`

- [ ] **Step 1: Import `useReveal`**

```tsx
import { useReveal } from "../hooks/useReveal";
```

- [ ] **Step 2: Dodaj reveal do głównych sekcji**

Dla każdej sekcji (Features, Timeline, Blog posts, CTA) dodaj `useReveal()` i podepnij `ref`:

```tsx
// Przykład dla sekcji Features:
function FeaturesSection() {
  const ref = useReveal();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="reveal py-24 section-blueprint">
      {/* istniejąca treść */}
    </section>
  );
}
```

Lub bez wyodrębniania — bezpośrednio na divie sekcji (jeśli nie jest `<section>`):
```tsx
const featuresRef = useReveal();
// ...
<div ref={featuresRef as React.RefObject<HTMLDivElement>} className="reveal ...">
```

- [ ] **Step 3: Stagger dla kart (Features cards grid)**

Na kartach features dodaj `--i` i klasę `reveal-stagger`:
```tsx
<div
  key={feature.title}
  className="reveal-stagger revealed bg-white ..."
  style={{ "--i": idx } as React.CSSProperties}
>
```
*Uwaga: karty w hero sekcji są już widoczne przy załadowaniu — `revealed` od razu.*

- [ ] **Step 4: Stagger dla kart blogowych na homepage**

```tsx
{blogPosts.map((post, idx) => (
  <article
    key={post.id}
    className="reveal-stagger bg-white ..."
    style={{ "--i": idx } as React.CSSProperties}
  >
```

- [ ] **Step 5: Trigger observer na kontenerze kart**

Dodaj `useReveal` na kontenerze gridu kart i w `useEffect` po reveal — dodaj klasę `revealed` do dzieci `.reveal-stagger`:

```tsx
// Prostszy sposób — jeden observer na całą sekcję kart
const gridRef = useReveal();
// W render:
<div ref={gridRef} className="reveal grid grid-cols-1 ...">
  {blogPosts.map((post, idx) => (
    <article className="reveal-stagger" style={{"--i": idx} as React.CSSProperties}>
```

Alternatywnie: Każda karta dostaje własny `useReveal` z delay. Dla uproszczenia — użyj `reveal` na gridzie, a karty automatycznie wychodzą razem.

- [ ] **Step 6: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 7: Commit**

```bash
git add src/pages/App.tsx
git commit -m "feat: scroll reveal na sekcjach homepage — fade-in z stagger"
```

---

## Chunk 3: Hover efekty kart + blueprint pulse

### Task 6: Hover efekty kart Wyroby

**Files:**
- Modify: `src/pages/Wyroby.tsx`
- Modify: `src/index.css` (hover utility)

- [ ] **Step 1: Dodaj CSS klasę `card-hover`**

W `src/index.css`:
```css
  .card-hover {
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(26, 86, 160, 0.12), 0 2px 8px rgba(0,0,0,0.06);
    border-color: rgba(139, 26, 60, 0.4);
  }
  .card-hover:hover .card-icon {
    transform: scale(1.15) rotate(4deg);
    transition: transform 0.25s ease;
  }
  .card-icon {
    transition: transform 0.25s ease;
  }
```

- [ ] **Step 2: Dodaj `card-hover` i `card-icon` do kart Wyroby**

W `src/pages/Wyroby.tsx` znajdź mapowanie kart wyrobów i dodaj klasy:
```tsx
<div className="... card-hover border border-slate-200 ...">
  {/* ikona: */}
  <div className="card-icon ...">
    {getCategorySketch(...)}
  </div>
```

- [ ] **Step 3: Hover efekty kart blogowych (BlogPage)**

Identycznie w `src/components/BlogPage.tsx` — karty artykułów:
```tsx
<article className="bg-white rounded-xl border border-slate-200 card-hover ...">
```

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/pages/Wyroby.tsx src/components/BlogPage.tsx
git commit -m "feat: hover efekty kart — translateY, wisnia border, ikona scale+rotate"
```

---

### Task 7: Blueprint pulse w hero sekcjach

**Files:**
- Modify: `src/index.css`
- Modify: `src/pages/App.tsx` (hero section)
- Modify: `src/components/BlogPage.tsx` (hero section)

- [ ] **Step 1: Dodaj keyframes `blueprintPulse` do `src/index.css`**

```css
  @keyframes blueprintPulse {
    0%, 100% { opacity: 0.03; }
    50% { opacity: 0.08; }
  }
  .blueprint-pulse::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(26,86,160,1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,86,160,1) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.04;
    animation: blueprintPulse 5s ease-in-out infinite;
    pointer-events: none;
  }
```

- [ ] **Step 2: Dodaj klasę `blueprint-pulse` do hero sections**

W `src/pages/App.tsx` hero section (ma `relative overflow-hidden`):
```tsx
<section className="relative min-h-[90vh] ... blueprint-pulse">
```

W `src/components/BlogPage.tsx` hero section:
```tsx
<section className="relative ... blueprint-pulse">
```

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/pages/App.tsx src/components/BlogPage.tsx
git commit -m "feat: blueprint pulse — animowana siatka w hero sekcjach"
```

---

## Chunk 4: Page transitions + reveal na pozostałych stronach

### Task 8: Page transition wrapper

**Files:**
- Create: `src/components/PageTransition.tsx`
- Modify: `src/AppWrapper.tsx` lub `src/router.tsx` (wrapper na `<Outlet>`)

- [ ] **Step 1: Sprawdź router structure**

```bash
cat src/router.tsx
cat src/AppWrapper.tsx
```

- [ ] **Step 2: Utwórz `src/components/PageTransition.tsx`**

```tsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return () => cancelAnimationFrame(raf);
  }, [location.pathname]);

  return <div ref={ref}>{children}</div>;
}
```

- [ ] **Step 3: Owiń `<Outlet>` lub `{children}` w routerze**

W `src/AppWrapper.tsx` (lub tam gdzie są route renders):
```tsx
import { PageTransition } from "./components/PageTransition";
// ...
<PageTransition>
  <Outlet />   {/* lub {children} zależnie od struktury */}
</PageTransition>
```

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add src/components/PageTransition.tsx src/AppWrapper.tsx
git commit -m "feat: page transition — fade-in przy każdej zmianie route"
```

---

### Task 9: Reveal na kluczowych stronach (BlogPage, Wyroby, Services)

**Files:**
- Modify: `src/components/BlogPage.tsx`
- Modify: `src/pages/Wyroby.tsx`
- Modify: `src/components/ServicesPage.tsx`

- [ ] **Step 1: Import `useReveal` w BlogPage, Wyroby, Services**

```tsx
import { useReveal } from "../hooks/useReveal";
```

- [ ] **Step 2: Dodaj reveal na gridach kart w BlogPage**

```tsx
const gridRef = useReveal();
// ...
<div ref={gridRef as React.RefObject<HTMLDivElement>} className="reveal grid ...">
  {posts.map((post, idx) => (
    <article
      className="reveal-stagger bg-white ..."
      style={{ "--i": idx } as React.CSSProperties}
    >
```

- [ ] **Step 3: Reveal na kartach Wyroby**

Identycznie — grid kart wyrobów dostaje `reveal` + karty dostają `reveal-stagger`.

- [ ] **Step 4: Reveal na sekcjach ServicesPage**

Każda sekcja usług dostaje `reveal` className i `ref={useReveal()}`.

- [ ] **Step 5: Final build**

```bash
npm run build 2>&1 | tail -3
```
Expected: `✓ built in`

- [ ] **Step 6: Final commit**

```bash
git add src/components/BlogPage.tsx src/pages/Wyroby.tsx src/components/ServicesPage.tsx
git commit -m "feat: scroll reveal na BlogPage, Wyroby, Services — stagger efekt kart"
git push origin main
```

---

## Podsumowanie zmian

| Plik | Zmiana |
|------|--------|
| `src/hooks/useReveal.ts` | Nowy — IntersectionObserver scroll reveal |
| `src/hooks/useCountUp.ts` | Nowy — animowany licznik |
| `src/components/ScrollProgressBar.tsx` | Nowy — wiśniowy→niebieski pasek postępu |
| `src/components/PageTransition.tsx` | Nowy — fade page transition |
| `src/index.css` | `.reveal`, `.reveal-stagger`, `.card-hover`, `.card-icon`, `blueprintPulse` |
| `src/components/Header.tsx` | `<ScrollProgressBar />` pod headerem |
| `src/pages/App.tsx` | `StatCounter` countUp, reveal na sekcjach, blueprint-pulse |
| `src/components/BlogPage.tsx` | `card-hover`, reveal grid, blueprint-pulse hero |
| `src/pages/Wyroby.tsx` | `card-hover`, reveal grid |
| `src/components/ServicesPage.tsx` | Reveal sekcje |
| `src/AppWrapper.tsx` | `<PageTransition>` wrapper |
