/**
 * BlueprintSketches — techniczne rysunki przekrojów wyrobów budowlanych
 * Styl: blueprint (niebieskie linie, kreskowanie, wymiary) na przezroczystym tle.
 * getCategorySketch: matchuje po TYTULE produktu, fallback na kategorię.
 */

type SketchProps = { className?: string; size?: number };
const S = "#1a56a0"; // niebieski
const A = "#8b1a3c"; // wiśniowy (wymiary, akcenty)

/** Beton / prefabrykaty / mur / kruszywa */
export function ConcreteSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      {/* Przekrój żelbetu: beton + zbrojenie */}
      <rect x="5" y="10" width="50" height="40" fill={`${S}08`} stroke={S} strokeWidth="1.2" />
      {/* Zbrojenie — 3 pręty */}
      {[17, 30, 43].map(x => (
        <circle key={x} cx={x} cy="40" r="3" fill="none" stroke={A} strokeWidth="1.1" />
      ))}
      {/* Strzemię */}
      <rect x="9" y="14" width="42" height="30" fill="none" stroke={A} strokeWidth="0.8" strokeDasharray="2,2" />
      {/* Kreskowanie kruszywa */}
      {[15, 22, 30, 38, 45].map(x =>
        [18, 24, 30].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill={`${S}40`} />
        ))
      )}
      {/* Wymiar */}
      <line x1="5" y1="56" x2="55" y2="56" stroke={A} strokeWidth="0.7" strokeDasharray="2,2" />
      <text x="30" y="55" textAnchor="middle" fontSize="5" fill={A} fontFamily="monospace">C25/30</text>
    </svg>
  );
}

/** Okna / drzwi / bramy / fasady / szkło */
export function WindowSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      <rect x="5" y="5" width="50" height="50" fill={`${S}05`} stroke={S} strokeWidth="1.3" />
      <rect x="12" y="12" width="36" height="36" fill={`${S}12`} stroke={S} strokeWidth="1" />
      <line x1="30" y1="12" x2="30" y2="48" stroke={S} strokeWidth="0.8" />
      <line x1="12" y1="30" x2="48" y2="30" stroke={S} strokeWidth="0.8" />
      {/* Rama — kreskowanie */}
      {[8, 12, 16].map(o => <line key={o} x1={5} y1={o} x2={o - 2} y2={5} stroke={S} strokeWidth="0.5" />)}
      {/* Klamka */}
      <rect x="27" y="27" width="6" height="3" fill={`${A}25`} stroke={A} strokeWidth="0.8" />
      <line x1="5" y1="58" x2="55" y2="58" stroke={A} strokeWidth="0.7" strokeDasharray="2,2" />
      <text x="30" y="57" textAnchor="middle" fontSize="5" fill={A} fontFamily="monospace">1200mm</text>
    </svg>
  );
}

/** Drewno / płyty drewnopochodne */
export function WoodSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      {/* Przekrój drewna z słojami */}
      <rect x="5" y="18" width="50" height="24" fill={`${S}06`} stroke={S} strokeWidth="1.3" />
      {/* Słoje roczne */}
      {[10, 20, 30, 40, 50].map(x => (
        <line key={x} x1={x} y1="18" x2={x} y2="42" stroke={S} strokeWidth="0.5" opacity="0.5" />
      ))}
      {/* Włókna drewna */}
      {[22, 27, 32, 37].map(y => (
        <path key={y} d={`M5,${y} Q17,${y - 2} 30,${y} Q43,${y + 2} 55,${y}`}
          fill="none" stroke={S} strokeWidth="0.6" opacity="0.6" />
      ))}
      {/* Wymiar grubości */}
      <line x1="2" y1="18" x2="2" y2="42" stroke={A} strokeWidth="0.8" />
      <line x1="0" y1="18" x2="4" y2="18" stroke={A} strokeWidth="0.8" />
      <line x1="0" y1="42" x2="4" y2="42" stroke={A} strokeWidth="0.8" />
      <text x="30" y="56" textAnchor="middle" fontSize="5" fill={A} fontFamily="monospace">GL24h</text>
    </svg>
  );
}

/** Izolacja termiczna / wełna / styropian */
export function InsulationSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      {/* Warstwy izolacji */}
      <rect x="5" y="8" width="50" height="44" fill={`${S}07`} stroke={S} strokeWidth="1.2" />
      {/* Pofałdowanie wełny */}
      {[13, 19, 25, 31, 37, 43, 49].map(y => (
        <path key={y} d={`M5,${y} Q18,${y - 5} 30,${y} Q42,${y + 5} 55,${y}`}
          fill="none" stroke={S} strokeWidth="0.7" opacity="0.7" />
      ))}
      {/* Strzałki przepływu ciepła */}
      <line x1="58" y1="10" x2="58" y2="50" stroke={A} strokeWidth="0.8" strokeDasharray="2,2" />
      <text x="30" y="57" textAnchor="middle" fontSize="5" fill={A} fontFamily="monospace">λ=0.036</text>
    </svg>
  );
}

/** Membrany hydroizolacyjne */
export function MembraneSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      {/* Podłoże */}
      <rect x="5" y="40" width="50" height="14" fill={`${S}05`} stroke={S} strokeWidth="1" />
      {/* Kreskowanie podłoże */}
      {[44, 48, 52].map(y =>
        [10, 18, 26, 34, 42, 50].map(x => (
          <line key={`${x}-${y}`} x1={x} y1={y - 3} x2={x - 4} y2={y} stroke={S} strokeWidth="0.5" />
        ))
      )}
      {/* Membrana — 2 warstwy */}
      <rect x="5" y="32" width="50" height="5" fill={`${S}20`} stroke={S} strokeWidth="1.2" />
      <rect x="5" y="26" width="50" height="6" fill={`${S}12`} stroke={S} strokeWidth="1" />
      {/* Uszczelnienie łączenia */}
      <rect x="22" y="24" width="16" height="3" fill={`${A}25`} stroke={A} strokeWidth="0.8" />
      <text x="30" y="57" textAnchor="middle" fontSize="5" fill={A} fontFamily="monospace">W1/W2</text>
    </svg>
  );
}

/** Stal zbrojeniowa / metalowe wyroby / łożyska / łączniki */
export function SteelBeamSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      <rect x="7" y="7" width="46" height="9" fill={`${S}07`} stroke={S} strokeWidth="1.3" />
      <rect x="24" y="16" width="12" height="28" fill={`${S}04`} stroke={S} strokeWidth="1.3" />
      <rect x="7" y="44" width="46" height="9" fill={`${S}07`} stroke={S} strokeWidth="1.3" />
      {[10, 18, 26, 34, 42, 50].map(x => (
        <line key={x} x1={x} y1="7" x2={x - 5} y2="16" stroke={S} strokeWidth="0.6" />
      ))}
      {[10, 18, 26, 34, 42, 50].map(x => (
        <line key={x} x1={x} y1="44" x2={x - 5} y2="53" stroke={S} strokeWidth="0.6" />
      ))}
      <line x1="2" y1="7" x2="2" y2="53" stroke={A} strokeWidth="0.7" strokeDasharray="2,2" />
      <line x1="0" y1="7" x2="4" y2="7" stroke={A} strokeWidth="0.7" />
      <line x1="0" y1="53" x2="4" y2="53" stroke={A} strokeWidth="0.7" />
    </svg>
  );
}

/** Pokrycia dachowe / okna dachowe */
export function RoofSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      {/* Kształt dachu */}
      <path d="M5,45 L30,10 L55,45 Z" fill={`${S}06`} stroke={S} strokeWidth="1.3" />
      {/* Dachówki — rzędy */}
      {[[20, 40], [15, 35], [10, 30]].map(([y, cnt], row) => (
        Array.from({ length: row + 3 }).map((_, i) => (
          <path key={`${row}-${i}`}
            d={`M${10 + i * (cnt / (row + 3))},${y} Q${10 + i * (cnt / (row + 3)) + 5},${y - 3} ${10 + i * (cnt / (row + 3)) + 10},${y}`}
            fill="none" stroke={S} strokeWidth="0.7" />
        ))
      ))}
      {/* Kalennica */}
      <line x1="30" y1="10" x2="30" y2="16" stroke={A} strokeWidth="1" />
      {/* Wymiar kąta */}
      <path d="M30,35 Q38,28 46,35" fill="none" stroke={A} strokeWidth="0.7" strokeDasharray="2,2" />
      <text x="30" y="57" textAnchor="middle" fontSize="5" fill={A} fontFamily="monospace">α=35°</text>
    </svg>
  );
}

/** Podłogi / posadzki / tynki / wyroby gipsowe */
export function FloorSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      {/* Warstwy podłogi od góry */}
      <rect x="5" y="12" width="50" height="6" fill={`${S}10`} stroke={S} strokeWidth="1.1" />
      <rect x="5" y="18" width="50" height="8" fill={`${S}06`} stroke={S} strokeWidth="1" />
      <rect x="5" y="26" width="50" height="10" fill={`${S}04`} stroke={S} strokeWidth="1" />
      <rect x="5" y="36" width="50" height="14" fill={`${S}05`} stroke={S} strokeWidth="1" />
      {/* Kreskowanie stropu */}
      {[40, 44, 48].map(y =>
        [10, 18, 26, 34, 42, 50].map(x => (
          <line key={`${x}-${y}`} x1={x} y1={y - 3} x2={x - 4} y2={y} stroke={S} strokeWidth="0.5" />
        ))
      )}
      {/* Etykiety warstw */}
      <text x="58" y="16" textAnchor="end" fontSize="5" fill={S} fontFamily="monospace">posadzka</text>
      <text x="58" y="23" textAnchor="end" fontSize="5" fill={S} fontFamily="monospace">wylewka</text>
      <text x="58" y="32" textAnchor="end" fontSize="5" fill={S} fontFamily="monospace">izolacja</text>
    </svg>
  );
}

/** Rury / instalacje / armatura / kominy / kanalizacja / woda */
export function PipeSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      <ellipse cx="30" cy="30" rx="22" ry="22" fill={`${S}06`} stroke={S} strokeWidth="1.3" />
      <ellipse cx="30" cy="30" rx="14" ry="14" fill="white" fillOpacity="0.6" stroke={S} strokeWidth="1" />
      <line x1="5" y1="30" x2="55" y2="30" stroke={A} strokeWidth="0.7" strokeDasharray="3,3" />
      <line x1="30" y1="5" x2="30" y2="55" stroke={A} strokeWidth="0.7" strokeDasharray="3,3" />
      <text x="30" y="57" textAnchor="middle" fontSize="5.5" fill={A} fontFamily="monospace">Ø110mm</text>
    </svg>
  );
}

/** Ochrona przeciwpożarowa / drzwi p.poż / urządzenia gaśnicze */
export function FireDoorSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      <path d="M8,55 L8,8 L52,8 L52,55" fill={`${S}05`} stroke={S} strokeWidth="1.3" />
      <line x1="5" y1="55" x2="55" y2="55" stroke={S} strokeWidth="1.3" />
      <rect x="12" y="12" width="36" height="43" fill={`${S}07`} stroke={S} strokeWidth="1.1" />
      {[9, 13, 17, 21].map(y => (
        <line key={y} x1="8" y1={y} x2={y} y2="8" stroke={S} strokeWidth="0.5" />
      ))}
      <circle cx="43" cy="35" r="2.5" fill={`${A}20`} stroke={A} strokeWidth="0.8" />
      <rect x="18" y="20" width="16" height="10" rx="1" fill={`${A}08`} stroke={A} strokeWidth="0.8" />
      <text x="26" y="27" textAnchor="middle" fontSize="5" fill={A} fontFamily="monospace" fontWeight="bold">EI 60</text>
      <line x1="2" y1="12" x2="2" y2="55" stroke={A} strokeWidth="0.7" strokeDasharray="2,2" />
    </svg>
  );
}

/** Chemia budowlana / kleje / tynki / uszczelnienia / spoiwa */
export function MortarSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      <rect x="5" y="35" width="50" height="18" fill={`${S}05`} stroke={S} strokeWidth="1.1" />
      <rect x="5" y="25" width="50" height="10" fill={`${S}10`} stroke={S} strokeWidth="1.2" />
      <rect x="5" y="15" width="50" height="10" fill={`${S}03`} stroke={S} strokeWidth="1" />
      {[0, 1, 2].map(row => [0, 1, 2, 3, 4].map(col => (
        <rect key={`${row}-${col}`}
          x={5 + col * 10 + (row % 2) * 5} y={37 + row * 5}
          width="9" height="4" stroke={S} strokeWidth="0.5" fill="none" />
      )))}
      <text x="58" y="20" textAnchor="end" fontSize="5" fill={S} fontFamily="monospace">tynk</text>
      <text x="58" y="31" textAnchor="end" fontSize="5" fill={S} fontFamily="monospace">klej</text>
      <text x="58" y="46" textAnchor="end" fontSize="5" fill={S} fontFamily="monospace">mur</text>
    </svg>
  );
}

/** Kable elektryczne / systemy detekcji */
export function CableSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      {/* Przekrój kabla koncentrycznego */}
      <circle cx="30" cy="30" r="22" fill={`${S}05`} stroke={S} strokeWidth="1.3" />
      <circle cx="30" cy="30" r="16" fill="white" fillOpacity="0.4" stroke={S} strokeWidth="0.8" />
      <circle cx="30" cy="30" r="10" fill={`${S}10`} stroke={S} strokeWidth="0.8" />
      <circle cx="30" cy="30" r="4" fill={`${A}30`} stroke={A} strokeWidth="0.8" />
      {/* Żyły — 3 fazy */}
      {[0, 120, 240].map(deg => {
        const r = 13;
        const rad = (deg * Math.PI) / 180;
        const cx = 30 + r * Math.cos(rad);
        const cy = 30 + r * Math.sin(rad);
        return <circle key={deg} cx={cx} cy={cy} r="2.5" fill={`${A}25`} stroke={A} strokeWidth="0.8" />;
      })}
      <text x="30" y="57" textAnchor="middle" fontSize="5" fill={A} fontFamily="monospace">3×1.5mm²</text>
    </svg>
  );
}

/** Wyroby drogowe / drogi / infrastruktura */
export function RoadSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      {/* Nawierzchnia */}
      <rect x="5" y="14" width="50" height="8" fill={`${S}12`} stroke={S} strokeWidth="1.2" />
      {/* Podbudowa zasadnicza */}
      <rect x="5" y="22" width="50" height="10" fill={`${S}07`} stroke={S} strokeWidth="1" />
      {/* Podbudowa pomocnicza */}
      <rect x="5" y="32" width="50" height="10" fill={`${S}04`} stroke={S} strokeWidth="1" />
      {/* Grunt */}
      <rect x="5" y="42" width="50" height="12" fill={`${S}03`} stroke={S} strokeWidth="0.8" />
      {/* Kreskowanie gruntu */}
      {[46, 50].map(y => [10, 18, 26, 34, 42, 50].map(x => (
        <line key={`${x}-${y}`} x1={x} y1={y - 3} x2={x - 4} y2={y} stroke={S} strokeWidth="0.5" />
      )))}
      <text x="58" y="19" textAnchor="end" fontSize="5" fill={A} fontFamily="monospace">SMA</text>
      <text x="58" y="28" textAnchor="end" fontSize="5" fill={S} fontFamily="monospace">AC</text>
    </svg>
  );
}

/** Geosyntetyki / geomembrany / wyroby geotechniczne */
export function GeoSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      {/* Siatka geotekstyliów */}
      {[12, 20, 28, 36, 44].map(y => (
        <line key={y} x1="5" y1={y} x2="55" y2={y} stroke={S} strokeWidth="0.8" />
      ))}
      {[10, 18, 26, 34, 42, 50].map(x => (
        <line key={x} x1={x} y1="10" x2={x} y2="46" stroke={S} strokeWidth="0.8" />
      ))}
      {/* Węzły siatki */}
      {[12, 20, 28, 36, 44].map(y =>
        [10, 18, 26, 34, 42, 50].map(x => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={S} opacity="0.5" />
        ))
      )}
      <text x="30" y="57" textAnchor="middle" fontSize="5" fill={A} fontFamily="monospace">GEOGRID</text>
    </svg>
  );
}

/** Domyślny CE blueprint — pozostałe kategorie */
export function CEBlueprintSketch({ size = 60 }: SketchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      {[10, 20, 30, 40, 50].map(v => (
        <g key={v}>
          <line x1={v} y1="0" x2={v} y2="60" stroke={S} strokeWidth="0.3" opacity="0.3" />
          <line x1="0" y1={v} x2="60" y2={v} stroke={S} strokeWidth="0.3" opacity="0.3" />
        </g>
      ))}
      <circle cx="30" cy="30" r="22" fill={`${S}05`} stroke={S} strokeWidth="1.3" />
      <text x="20" y="38" fontSize="22" fontWeight="bold" fill="none" stroke={S} strokeWidth="1.5" fontFamily="serif">CE</text>
      <line x1="30" y1="4" x2="30" y2="9" stroke={A} strokeWidth="1.5" />
      <line x1="30" y1="51" x2="30" y2="56" stroke={A} strokeWidth="1.5" />
      <line x1="4" y1="30" x2="9" y2="30" stroke={A} strokeWidth="1.5" />
      <line x1="51" y1="30" x2="56" y2="30" stroke={A} strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Wybór szkicu na podstawie TYTUŁU produktu (priorytet) i kategorii (fallback).
 * Obejmuje wszystkie 36 rodzin wyrobów wg CPR 2024/3110 Załącznik VII.
 */
export function getCategorySketch(title: string, category?: string, size = 44) {
  const t = (title ?? "").toLowerCase();
  const c = (category ?? "").toLowerCase();

  // --- BETON / MUR / KRUSZYWA ---
  if (/beton|prefabrykat|murowy|cegł|kruszywa|wapno|cement|spoiwa|bloczk|pustak/.test(t))
    return <ConcreteSketch size={size} />;

  // --- DREWNO ---
  if (/drewno|drewn|płyt.*drewno|drewno.*płyt|clb|glulam|sklejka/.test(t))
    return <WoodSketch size={size} />;

  // --- IZOLACJA TERMICZNA ---
  if (/izolacja|wełna|styropian|eps|xps|pir|pur|etics/.test(t))
    return <InsulationSketch size={size} />;

  // --- HYDROIZOLACJE / MEMBRANY ---
  if (/membran|hydroizol|bitum|papa|uszczel/.test(t))
    return <MembraneSketch size={size} />;

  // --- OKNA / DRZWI / FASADY / SZKŁO ---
  if (/okna|okno|drzwi|brama|fasad|szkło|przeszkleni|świetlik/.test(t))
    return <WindowSketch size={size} />;

  // --- POKRYCIA DACHOWE ---
  if (/dach|pokryci|dachów|dachowe|blachodachów/.test(t))
    return <RoofSketch size={size} />;

  // --- PODŁOGI / POSADZKI / TYNKI / GIPS ---
  if (/podłog|posadzk|tynk|gips|okładzin|ścian.*działow|laminat/.test(t))
    return <FloorSketch size={size} />;

  // --- STAL / METALOWE / ŁOŻYSKA / ŁĄCZNIKI ---
  if (/stal|metalow|żelbetow|zbrojeni|łożysk|kotw|łącznik|sworzn|zamoc/.test(t))
    return <SteelBeamSketch size={size} />;

  // --- RURY / INSTALACJE / ARMATURA / KOMINY ---
  if (/rur|zbiornik|instalac|kanalizac|komin|armatur|grzewcz|wentyl|klimat|woda pitna/.test(t))
    return <PipeSketch size={size} />;

  // --- KABLE / ELEKTRYCZNE / DETEKCJA ---
  if (/kabel|kable|elektr|detekcj|sygnaliz|alarmow/.test(t))
    return <CableSketch size={size} />;

  // --- OCHRONA POŻAROWA ---
  if (/pożar|ogniow|gaśnicz|gaśn|ppoż|fire|dym/.test(t))
    return <FireDoorSketch size={size} />;

  // --- DROGI / INFRASTRUKTURA ---
  if (/drogowy|drogi|nawierzch|chodnik|krawężnik|inżyniersk|mostow/.test(t))
    return <RoadSketch size={size} />;

  // --- GEOSYNTETYKI ---
  if (/geosynt|geomembran|geotekst|geosiatk|geotech/.test(t))
    return <GeoSketch size={size} />;

  // --- CHEMIA BUDOWLANA / KLEJE / ZAPRAWY ---
  if (/klej|zaprawa|chemia|uszczel|fugę|fugi|impregnat|powłok/.test(t))
    return <MortarSketch size={size} />;

  // --- FALLBACK na kategorię ---
  if (/konstrukc|stal|beton/.test(c)) return <SteelBeamSketch size={size} />;
  if (/wykończ|okna|drzwi|fasad/.test(c)) return <WindowSketch size={size} />;
  if (/instal|rur/.test(c)) return <PipeSketch size={size} />;
  if (/pożar|ogni/.test(c)) return <FireDoorSketch size={size} />;
  if (/chemia|klej/.test(c)) return <MortarSketch size={size} />;
  if (/izolac/.test(c)) return <InsulationSketch size={size} />;
  if (/dach/.test(c)) return <RoofSketch size={size} />;
  if (/elektr|kabel/.test(c)) return <CableSketch size={size} />;
  if (/drog/.test(c)) return <RoadSketch size={size} />;
  if (/geo/.test(c)) return <GeoSketch size={size} />;

  return <CEBlueprintSketch size={size} />;
}
