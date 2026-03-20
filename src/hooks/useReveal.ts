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
