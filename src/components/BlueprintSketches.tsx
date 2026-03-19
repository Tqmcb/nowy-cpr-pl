/**
 * BlueprintSketches — techniczne rysunki przekrojów wyrobów budowlanych
 * Styl: blueprint (niebieskie linie, kreskowanie, wymiary) na przezroczystym tle.
 * Używane jako dekoracja na kartach Wyroby i sekcjach App.
 */

type SketchProps = { className?: string; size?: number };

/** Przekrój belki stalowej (I-profil) — Wyroby konstrukcyjne */
export function SteelBeamSketch({ className = "", size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} aria-hidden>
      <style>{`.bp{stroke:#1a56a0;fill:none;stroke-width:1.3;stroke-linecap:round}`}</style>
      {/* Top flange */}
      <rect x="7" y="7" width="46" height="9" className="bp" fill="rgba(26,86,160,0.07)" />
      {/* Web */}
      <rect x="24" y="16" width="12" height="28" className="bp" fill="rgba(26,86,160,0.04)" />
      {/* Bottom flange */}
      <rect x="7" y="44" width="46" height="9" className="bp" fill="rgba(26,86,160,0.07)" />
      {/* Hatching top flange */}
      {[10,18,26,34,42,50].map(x => (
        <line key={x} x1={x} y1="7" x2={x-5} y2="16" className="bp" strokeWidth="0.6" />
      ))}
      {/* Hatching bottom flange */}
      {[10,18,26,34,42,50].map(x => (
        <line key={x} x1={x} y1="44" x2={x-5} y2="53" className="bp" strokeWidth="0.6" />
      ))}
      {/* Dimension line */}
      <line x1="2" y1="7" x2="2" y2="53" stroke="#8b1a3c" strokeWidth="0.7" strokeDasharray="2,2" />
      <line x1="0" y1="7" x2="4" y2="7" stroke="#8b1a3c" strokeWidth="0.7" />
      <line x1="0" y1="53" x2="4" y2="53" stroke="#8b1a3c" strokeWidth="0.7" />
    </svg>
  );
}

/** Przekrój okna PCV — Wyroby wykończeniowe */
export function WindowSketch({ className = "", size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} aria-hidden>
      <style>{`.bpw{stroke:#1a56a0;fill:none;stroke-width:1.3;stroke-linecap:round}`}</style>
      {/* Outer frame */}
      <rect x="5" y="5" width="50" height="50" className="bpw" fill="rgba(26,86,160,0.05)" />
      {/* Inner glass */}
      <rect x="12" y="12" width="36" height="36" className="bpw" fill="rgba(26,86,160,0.12)" />
      {/* Cross divider */}
      <line x1="30" y1="12" x2="30" y2="48" className="bpw" strokeWidth="0.8" />
      <line x1="12" y1="30" x2="48" y2="30" className="bpw" strokeWidth="0.8" />
      {/* Frame hatching */}
      {[8,13,18].map(o => (
        <line key={o} x1={5} y1={o} x2={o-2} y2={5} className="bpw" strokeWidth="0.5" />
      ))}
      {/* Handle */}
      <rect x="27" y="27" width="6" height="3" className="bpw" fill="rgba(139,26,60,0.15)" stroke="#8b1a3c" strokeWidth="0.8" />
      {/* Dimension */}
      <line x1="5" y1="58" x2="55" y2="58" stroke="#8b1a3c" strokeWidth="0.7" strokeDasharray="2,2" />
      <text x="30" y="57" textAnchor="middle" fontSize="5" fill="#8b1a3c" fontFamily="monospace">1200mm</text>
    </svg>
  );
}

/** Przekrój rury instalacyjnej — Instalacyjne */
export function PipeSketch({ className = "", size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} aria-hidden>
      <style>{`.bpp{stroke:#1a56a0;fill:none;stroke-width:1.3;stroke-linecap:round}`}</style>
      {/* Outer pipe ellipse */}
      <ellipse cx="30" cy="30" rx="22" ry="22" className="bpp" fill="rgba(26,86,160,0.06)" />
      {/* Inner bore */}
      <ellipse cx="30" cy="30" rx="14" ry="14" className="bpp" fill="rgba(255,255,255,0.5)" />
      {/* Wall hatching */}
      {[-15,-10,-5,0,5,10,15].map(d => (
        <line key={d}
          x1={30+d-5} y1={30-Math.sqrt(Math.max(0,484-(d-5)*(d-5)))}
          x2={30+d+5} y2={30-Math.sqrt(Math.max(0,484-(d+5)*(d+5)))}
          className="bpp" strokeWidth="0.5"
        />
      ))}
      {/* Centre lines */}
      <line x1="5" y1="30" x2="55" y2="30" stroke="#8b1a3c" strokeWidth="0.7" strokeDasharray="3,3" />
      <line x1="30" y1="5" x2="30" y2="55" stroke="#8b1a3c" strokeWidth="0.7" strokeDasharray="3,3" />
      {/* Dimension Ø */}
      <text x="30" y="57" textAnchor="middle" fontSize="5.5" fill="#8b1a3c" fontFamily="monospace">Ø110mm</text>
    </svg>
  );
}

/** Przekrój drzwi przeciwpożarowych — Ochrona przeciwpożarowa */
export function FireDoorSketch({ className = "", size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} aria-hidden>
      <style>{`.bpf{stroke:#1a56a0;fill:none;stroke-width:1.3;stroke-linecap:round}`}</style>
      {/* Door frame */}
      <path d="M8,55 L8,8 L52,8 L52,55" className="bpf" fill="rgba(26,86,160,0.05)" />
      <line x1="5" y1="55" x2="55" y2="55" className="bpf" />
      {/* Door panel */}
      <rect x="12" y="12" width="36" height="43" className="bpf" fill="rgba(26,86,160,0.07)" />
      {/* Frame core hatching */}
      {[9,13,17,21].map(y => (
        <line key={y} x1="8" y1={y} x2={y} y2="8" className="bpf" strokeWidth="0.5" />
      ))}
      {/* Handle */}
      <circle cx="43" cy="35" r="2.5" className="bpf" fill="rgba(139,26,60,0.2)" stroke="#8b1a3c" strokeWidth="0.8" />
      {/* Fire rating badge */}
      <rect x="18" y="20" width="16" height="10" rx="1" className="bpf" fill="rgba(139,26,60,0.08)" stroke="#8b1a3c" strokeWidth="0.8" />
      <text x="26" y="27" textAnchor="middle" fontSize="5" fill="#8b1a3c" fontFamily="monospace" fontWeight="bold">EI 60</text>
      {/* Dimension */}
      <line x1="2" y1="12" x2="2" y2="55" stroke="#8b1a3c" strokeWidth="0.7" strokeDasharray="2,2" />
    </svg>
  );
}

/** Przekrój tynku/zaprawy — Chemia budowlana */
export function MortarSketch({ className = "", size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} aria-hidden>
      <style>{`.bpm{stroke:#1a56a0;fill:none;stroke-width:1.3;stroke-linecap:round}`}</style>
      {/* Substrate layer */}
      <rect x="5" y="35" width="50" height="18" className="bpm" fill="rgba(26,86,160,0.05)" />
      {/* Adhesive layer */}
      <rect x="5" y="25" width="50" height="10" className="bpm" fill="rgba(26,86,160,0.10)" />
      {/* Finish layer */}
      <rect x="5" y="15" width="50" height="10" className="bpm" fill="rgba(26,86,160,0.03)" />
      {/* Substrate hatching (bricks) */}
      {[0,1,2].map(row => [0,1,2,3,4].map(col => (
        <rect key={`${row}-${col}`}
          x={5 + col*10 + (row%2)*5} y={37 + row*5}
          width="9" height="4"
          stroke="#1a56a0" strokeWidth="0.5" fill="none"
        />
      )))}
      {/* Layer labels */}
      <text x="58" y="20" textAnchor="end" fontSize="5" fill="#1a56a0" fontFamily="monospace">tynk 3mm</text>
      <text x="58" y="31" textAnchor="end" fontSize="5" fill="#1a56a0" fontFamily="monospace">klej 5mm</text>
      <text x="58" y="46" textAnchor="end" fontSize="5" fill="#1a56a0" fontFamily="monospace">podłoże</text>
    </svg>
  );
}

/** Ogólny szkic CE — Inne kategorie */
export function CEBlueprintSketch({ className = "", size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} aria-hidden>
      <style>{`.bpc{stroke:#1a56a0;fill:none;stroke-width:1.3;stroke-linecap:round}`}</style>
      {/* Blueprint grid */}
      {[10,20,30,40,50].map(v => (
        <g key={v}>
          <line x1={v} y1="0" x2={v} y2="60" stroke="#1a56a0" strokeWidth="0.3" opacity="0.3" />
          <line x1="0" y1={v} x2="60" y2={v} stroke="#1a56a0" strokeWidth="0.3" opacity="0.3" />
        </g>
      ))}
      {/* CE circle */}
      <circle cx="30" cy="30" r="22" className="bpc" fill="rgba(26,86,160,0.05)" />
      {/* CE letters */}
      <text x="20" y="38" fontSize="22" fontWeight="bold" fill="none" stroke="#1a56a0" strokeWidth="1.5" fontFamily="serif">CE</text>
      {/* Registration mark tick */}
      <line x1="30" y1="4" x2="30" y2="9" stroke="#8b1a3c" strokeWidth="1.5" />
      <line x1="30" y1="51" x2="30" y2="56" stroke="#8b1a3c" strokeWidth="1.5" />
      <line x1="4" y1="30" x2="9" y2="30" stroke="#8b1a3c" strokeWidth="1.5" />
      <line x1="51" y1="30" x2="56" y2="30" stroke="#8b1a3c" strokeWidth="1.5" />
    </svg>
  );
}

/** Mapa kategorii → komponent szkicu */
export function getCategorySketch(category: string, size = 44) {
  const cat = category?.toLowerCase() ?? "";
  if (cat.includes("konstrukc") || cat.includes("stal") || cat.includes("beton"))
    return <SteelBeamSketch size={size} />;
  if (cat.includes("wykończ") || cat.includes("okna") || cat.includes("drzwi") || cat.includes("posadzk"))
    return <WindowSketch size={size} />;
  if (cat.includes("instal") || cat.includes("rur") || cat.includes("kanalizac"))
    return <PipeSketch size={size} />;
  if (cat.includes("pożar") || cat.includes("ogn"))
    return <FireDoorSketch size={size} />;
  if (cat.includes("chemia") || cat.includes("tynk") || cat.includes("klej") || cat.includes("zaprawa"))
    return <MortarSketch size={size} />;
  return <CEBlueprintSketch size={size} />;
}
