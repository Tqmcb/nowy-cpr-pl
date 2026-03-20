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
