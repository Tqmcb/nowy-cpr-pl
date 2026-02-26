import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, ChevronDown, ChevronUp, Shield, BarChart2, Megaphone } from "lucide-react";

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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800 ${
        disabled
          ? "bg-amber-400/60 cursor-not-allowed"
          : checked
          ? "bg-amber-400 cursor-pointer"
          : "bg-slate-600 cursor-pointer"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
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
    localStorage.setItem(
      CONSENT_KEY,
      analytics || marketing ? "partial" : "necessary"
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Zgoda na pliki cookie"
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl shadow-black/40"
    >
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Main row */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          {/* Icon + text */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/25 flex items-center justify-center mt-0.5">
              <Cookie className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm mb-1">
                Ta strona używa plików cookie
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Używamy plików cookie, aby zapewnić prawidłowe działanie serwisu, analizować ruch
                i personalizować treści. Możesz zaakceptować wszystkie pliki cookie lub zarządzać
                swoimi preferencjami. Więcej informacji znajdziesz w naszej{" "}
                <Link
                  to="/polityka-prywatnosci"
                  className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors duration-200"
                >
                  Polityce prywatności
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200"
              aria-expanded={expanded}
              aria-controls="cookie-preferences-panel"
            >
              Zarządzaj preferencjami
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={acceptNecessary}
              className="flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-700/80 hover:bg-slate-600/80 border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              Tylko niezbędne
            </button>
            <button
              onClick={acceptAll}
              className="flex items-center justify-center px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-900 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200"
            >
              Zaakceptuj wszystkie
            </button>
          </div>
        </div>

        {/* Expanded preferences panel */}
        <div
          id="cookie-preferences-panel"
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expanded ? "max-h-[600px] opacity-100 mt-5" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!expanded}
        >
          <div className="pt-5 border-t border-white/10">
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Poniżej możesz dostosować, które kategorie plików cookie akceptujesz. Pliki
              niezbędne zawsze pozostają aktywne, ponieważ są wymagane do prawidłowego
              funkcjonowania serwisu.
            </p>

            <div className="space-y-3">
              {/* Necessary */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/8">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mt-0.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">Niezbędne</span>
                      <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5">
                        Zawsze aktywne
                      </span>
                    </div>
                    <ToggleSwitch
                      id="toggle-necessary"
                      checked={true}
                      onChange={() => {}}
                      disabled={true}
                    />
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Sesja użytkownika, preferencje wyglądu, bezpieczeństwo formularzy. Niezbędne
                    do podstawowego działania serwisu — nie mogą być wyłączone.
                  </p>
                </div>
              </div>

              {/* Analytic */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/8">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mt-0.5">
                  <BarChart2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <label
                      htmlFor="toggle-analytics"
                      className="text-white text-sm font-medium cursor-pointer"
                    >
                      Analityczne
                    </label>
                    <ToggleSwitch
                      id="toggle-analytics"
                      checked={analytics}
                      onChange={setAnalytics}
                    />
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Google Analytics, analiza ruchu na stronie, statystyki odwiedzin. Pomagają
                    nam rozumieć, jak użytkownicy korzystają z serwisu, co pozwala stale go
                    ulepszać.
                  </p>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/8">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mt-0.5">
                  <Megaphone className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <label
                      htmlFor="toggle-marketing"
                      className="text-white text-sm font-medium cursor-pointer"
                    >
                      Marketingowe
                    </label>
                    <ToggleSwitch
                      id="toggle-marketing"
                      checked={marketing}
                      onChange={setMarketing}
                    />
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Retargeting reklamowy, piksele społecznościowe (Facebook, LinkedIn). Służą do
                    wyświetlania trafnych reklam oraz pomiaru skuteczności kampanii.
                  </p>
                </div>
              </div>
            </div>

            {/* Save preferences button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={savePreferences}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-900 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200"
              >
                Zapisz moje preferencje
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
