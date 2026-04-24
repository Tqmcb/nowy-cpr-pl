import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const CONSENT_KEY = "nowycpr_cookie_consent";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  id: string;
}

function ToggleSwitch({ checked, onChange, disabled = false, id }: ToggleSwitchProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className="relative inline-flex h-5 w-9 items-center transition-colors duration-200 focus:outline-none"
      style={{
        backgroundColor: disabled
          ? "oklch(55% .22 27 / 0.5)"
          : checked
          ? "oklch(55% .22 27)"
          : "oklch(86% .012 264)",
        borderRadius: "2px",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <span
        className="inline-block h-3 w-3 transform bg-white transition-transform duration-200"
        style={{
          transform: checked ? "translateX(20px)" : "translateX(4px)",
        }}
      />
    </button>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const acceptAll = () => {
    localStorage.setItem(CONSENT_KEY, "all");
    setVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem(CONSENT_KEY, "necessary");
    setVisible(false);
  };

  const savePreferences = () => {
    localStorage.setItem(CONSENT_KEY, analytics || marketing ? "partial" : "necessary");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Zgoda na pliki cookie"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white"
      style={{ borderTop: "1px solid oklch(92% .008 264)", boxShadow: "0 -4px 20px rgba(0,0,0,0.05)" }}
    >
      {/* Brand-red top rule */}
      <div className="absolute top-0 left-0 h-[3px] w-24" style={{ backgroundColor: "oklch(55% .22 27)" }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
        <div className="flex flex-col lg:flex-row lg:items-start gap-3 sm:gap-5">
          <div className="flex-1 min-w-0">
            <div className="editorial-kicker mb-1 sm:mb-2" style={{ color: "oklch(55% .22 27)" }}>
              Pliki cookie
            </div>
            <h3 className="font-serif text-lg sm:text-xl leading-[1.15] mb-1 sm:mb-2" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
              Używamy plików <span className="italic" style={{ color: "oklch(55% .22 27)" }}>cookie</span>
            </h3>
            <p className="text-xs sm:text-sm leading-[1.45] sm:leading-[1.6] max-w-2xl" style={{ color: "oklch(42% .02 264)" }}>
              Niezbędne pliki działają zawsze. Analityczne i marketingowe włączamy tylko po zgodzie. Szczegóły w{" "}
              <a
                href="/polityka-prywatnosci"
                className="underline underline-offset-2 transition-colors hover:opacity-70"
                style={{ color: "oklch(55% .22 27)" }}
              >
                Polityce prywatności
              </a>.
            </p>
          </div>

          <div className="grid w-full min-w-0 grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-2 lg:w-auto lg:flex-shrink-0">
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="editorial-kicker flex min-w-0 items-center justify-center gap-1.5 overflow-hidden px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap transition-all hover:bg-slate-50"
              style={{ color: "oklch(42% .02 264)", border: "1px solid oklch(86% .012 264)", borderRadius: "2px" }}
              aria-expanded={expanded}
              aria-controls="cookie-preferences-panel"
            >
              <span className="sm:hidden">Opcje</span>
              <span className="hidden sm:inline">Zarządzaj preferencjami</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
            </button>
            <button
              onClick={acceptNecessary}
              className="editorial-kicker min-w-0 overflow-hidden px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap transition-all hover:bg-slate-50"
              style={{ color: "oklch(20% .03 264)", border: "1px solid oklch(20% .03 264)", borderRadius: "2px" }}
            >
              <span className="sm:hidden">Min.</span>
              <span className="hidden sm:inline">Tylko niezbędne</span>
            </button>
            <button
              onClick={acceptAll}
              className="editorial-kicker col-span-2 min-w-0 text-white px-4 sm:px-5 py-2.5 sm:py-3 whitespace-nowrap transition-all hover:opacity-90"
              style={{ backgroundColor: "oklch(55% .22 27)", borderRadius: "2px" }}
            >
              Zaakceptuj wszystkie
            </button>
          </div>
        </div>

        {/* Expanded preferences panel */}
        <div
          id="cookie-preferences-panel"
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expanded ? "max-h-[600px] opacity-100 mt-4 sm:mt-6" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!expanded}
        >
          <div className="pt-4 sm:pt-6" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
            <p className="text-xs sm:text-sm mb-4 sm:mb-6 leading-[1.55] max-w-3xl" style={{ color: "oklch(42% .02 264)" }}>
              Poniżej możesz dostosować kategorie plików cookie. Pliki niezbędne zawsze pozostają aktywne.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
              {[
                { key: "necessary", title: "Niezbędne", desc: "Sesja użytkownika, preferencje, bezpieczeństwo formularzy.", checked: true, disabled: true, onChange: () => {}, badge: "Zawsze aktywne" },
                { key: "analytics", title: "Analityczne", desc: "Google Analytics, statystyki odwiedzin, analiza ruchu.", checked: analytics, disabled: false, onChange: setAnalytics, badge: null },
                { key: "marketing", title: "Marketingowe", desc: "Retargeting, piksele społecznościowe (Meta, LinkedIn).", checked: marketing, disabled: false, onChange: setMarketing, badge: null },
              ].map((cat, idx) => (
                <div
                  key={cat.key}
                  className="p-4 sm:p-6"
                  style={{
                    borderRight: idx < 2 ? "1px solid oklch(92% .008 264)" : "none",
                    borderBottom: "1px solid oklch(92% .008 264)",
                  }}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2">
                      <span className="editorial-numeral text-2xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <ToggleSwitch id={`toggle-${cat.key}`} checked={cat.checked} onChange={cat.onChange} disabled={cat.disabled} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-serif text-base sm:text-lg" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>{cat.title}</h4>
                    {cat.badge && (
                      <span className="editorial-kicker" style={{ color: "oklch(55% .14 155)" }}>· {cat.badge}</span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm leading-[1.5] sm:leading-[1.55]" style={{ color: "oklch(42% .02 264)" }}>{cat.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4 sm:mt-6">
              <button
                onClick={savePreferences}
                className="editorial-kicker text-white px-5 py-2.5 sm:py-3 transition-all hover:opacity-90"
                style={{ backgroundColor: "oklch(20% .03 264)", borderRadius: "2px" }}
              >
                Zapisz preferencje
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
