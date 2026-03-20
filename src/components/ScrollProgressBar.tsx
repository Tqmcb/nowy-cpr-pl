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
