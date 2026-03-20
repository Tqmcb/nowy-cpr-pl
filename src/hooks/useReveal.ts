import { useCallback, useRef } from "react";

/**
 * Zwraca callback ref — podepnij do kontenera.
 * Gdy element wejdzie w viewport, otrzyma klasę "revealed".
 * Używa callback ref zamiast useRef, dzięki czemu działa poprawnie
 * nawet gdy element montuje się warunkowo (np. po załadowaniu danych).
 *
 * CSS: .reveal { opacity:0; transform:translateY(20px); transition:... }
 *       .revealed { opacity:1; transform:none }
 */
export function useReveal(threshold = 0.15) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const callbackRef = useCallback(
    (el: HTMLElement | null) => {
      // Rozłącz poprzedni observer jeśli istnieje
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!el) return;

      // Jeśli element już jest w viewport (np. grid po async load) — ujawnij od razu,
      // bo IntersectionObserver jest async i może spóźnić się o kilka klatek.
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("revealed");
        return;
      }

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("revealed");
            observerRef.current?.unobserve(el);
          }
        },
        { threshold }
      );
      observerRef.current.observe(el);
    },
    [threshold]
  );

  return callbackRef;
}
