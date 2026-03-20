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
