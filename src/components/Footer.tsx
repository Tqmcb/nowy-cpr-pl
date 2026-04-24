import React from "react";
import { Container } from "./Container";
import { Link } from "react-router-dom";
import { MapPin, Mail, Send, Linkedin, Twitter, Facebook, Home, Search, FileText, Award, BookOpen, Shield, ExternalLink, Info } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const textBody = "oklch(70% .015 264)";
  const textMuted = "oklch(55% .015 264)";
  const borderCol = "oklch(30% .03 264)";
  const brandRed = "oklch(55% .22 27)";

  return (
    <footer role="contentinfo" className="relative pt-12 pb-6" style={{ backgroundColor: "oklch(20% .03 264)" }}>
      {/* Brand-red top rule — sygnatura */}
      <div className="absolute top-0 left-0 h-[5px] w-28" style={{ backgroundColor: brandRed }} />

      <Container>
        {/* Masthead band — section numerals */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-baseline gap-4 pb-4" style={{ borderBottom: `1px solid ${borderCol}` }}>
            <span className="editorial-numeral text-4xl md:text-5xl" style={{ color: brandRed, fontWeight: 300 }}>06</span>
            <div className="flex items-center gap-3 pt-3">
              <div className="h-[2px] w-10" style={{ backgroundColor: brandRed }} />
              <span className="editorial-kicker" style={{ color: textBody }}>Stopka redakcyjna</span>
            </div>
            <div className="ml-auto pt-3 editorial-kicker hidden md:block" style={{ color: textMuted }}>
              Wydanie ciągłe · {new Date().toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-3 flex items-baseline">
              <span className="text-2xl font-serif italic" style={{ color: "white", fontWeight: 600 }}>Nowy</span>
              <span className="text-2xl font-serif" style={{ color: "white", fontWeight: 600 }}>CPR</span>
              <span className="text-2xl font-serif" style={{ color: brandRed, fontWeight: 600 }}>.pl</span>
            </div>
            <p className="text-sm leading-[1.55] mb-3" style={{ color: textBody }}>
              Kompleksowe wsparcie dla producentów wyrobów budowlanych w kontekście Rozporządzenia CPR (EU) 2024/3110.
            </p>
            <p className="editorial-kicker mb-3" style={{ color: textMuted }}>Wydawca</p>
            <p className="font-serif text-base italic mb-4" style={{ color: "white", fontWeight: 500 }}>Multicert Sp. z o.o.</p>
            <div className="flex gap-2">
              {[
                { href: "https://www.linkedin.com/company/multicert-certyfikacja-wyrobow/", label: "LinkedIn", Icon: Linkedin },
                { href: "https://twitter.com/multicert_pl", label: "Twitter", Icon: Twitter },
                { href: "https://www.facebook.com/MulticertCertyfikacja", label: "Facebook", Icon: Facebook },
              ].map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Multicert na ${label}`}
                  className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ border: `1px solid ${borderCol}`, color: textBody, borderRadius: "2px" }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Linki */}
          <div>
            <h3 className="editorial-kicker mb-3 pb-3" style={{ color: "white", borderBottom: `1px solid ${borderCol}` }}>Przydatne linki</h3>
            <ul className="space-y-2">
              {[
                { path: "/", label: "Strona Główna", icon: Home },
                { path: "/wyszukiwarka", label: "Wyszukiwarka CPR", icon: Search },
                { path: "/documents", label: "Dokumenty", icon: FileText },
                { path: "/services", label: "Usługi certyfikacyjne", icon: Award },
                { path: "/blog", label: "Blog", icon: BookOpen },
                { path: "/o-portalu", label: "O portalu", icon: Info },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm flex items-center gap-2.5 transition-colors hover:text-white" style={{ color: textBody }}>
                    <link.icon className="w-3.5 h-3.5 opacity-60" />{link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="editorial-kicker mb-3 pb-3" style={{ color: "white", borderBottom: `1px solid ${borderCol}` }}>Kontakt</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2.5" style={{ color: textBody }}>
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-60" />
                <div>
                  <p className="font-serif italic text-base mb-1" style={{ color: "white", fontWeight: 500 }}>Multicert Sp. z o.o.</p>
                  <p>Mydlarska 47, 04-690 Warszawa</p>
                </div>
              </li>
              <li>
                <a href="mailto:biuro@multicert.pl" className="flex items-center gap-2.5 transition-colors hover:text-white" style={{ color: textBody }}>
                  <Mail className="w-4 h-4 opacity-60" />biuro@multicert.pl
                </a>
              </li>
            </ul>
            <div className="mt-6 p-4" style={{ border: `1px solid ${borderCol}`, borderLeft: `2px solid ${brandRed}` }}>
              <a href="https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32024R3110" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs transition-colors hover:opacity-80" style={{ color: brandRed }}>
                <Shield className="w-3.5 h-3.5" />
                <span className="editorial-kicker" style={{ color: brandRed }}>Oficjalny tekst CPR</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="editorial-kicker mb-3 pb-3" style={{ color: "white", borderBottom: `1px solid ${borderCol}` }}>Newsletter</h3>
            <p className="font-serif text-lg italic leading-[1.35] mb-3" style={{ color: "white", fontWeight: 500 }}>
              Bądź na bieżąco ze zmianami w przepisach CPR.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const honeypot = form.querySelector('input[name="website"]') as HTMLInputElement;
              const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
              const nameInput = form.querySelector('input[id="newsletter-name"]') as HTMLInputElement;
              if (honeypot?.value) return;
              if (emailInput?.value) {
                import('utils/newsletterHelpers').then(({ subscribeToNewsletter, validateEmail }) => {
                  if (!validateEmail(emailInput.value)) { alert("Proszę podać prawidłowy adres email"); return; }
                  subscribeToNewsletter(emailInput.value, 'footer-newsletter', nameInput?.value || '')
                    .then(success => {
                      if (success) { alert("Dziękujemy za zapisanie się!"); emailInput.value = ''; if (nameInput) nameInput.value = ''; }
                      else { alert("Wystąpił problem. Spróbuj ponownie."); }
                    });
                });
              }
            }}>
              <div className="space-y-2.5">
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <label htmlFor="newsletter-name" className="sr-only">Twoje imię</label>
                <input id="newsletter-name" type="text" placeholder="Twoje imię"
                  className="w-full px-3 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ backgroundColor: "transparent", border: `1px solid ${borderCol}`, color: "white", borderRadius: "2px" }} />
                <label htmlFor="newsletter-email" className="sr-only">Twój e-mail</label>
                <input id="newsletter-email" type="email" placeholder="Twój e-mail" required
                  className="w-full px-3 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ backgroundColor: "transparent", border: `1px solid ${borderCol}`, color: "white", borderRadius: "2px" }} />
                <button type="submit"
                  className="w-full py-3 text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 hover:opacity-90"
                  style={{ backgroundColor: brandRed, borderRadius: "2px" }}>
                  <Send className="w-3.5 h-3.5" />Zapisz się
                </button>
              </div>
              <p className="text-xs mt-3" style={{ color: textMuted }}>Dane wyłącznie do wysyłki newslettera.</p>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto pt-6" style={{ borderTop: `1px solid ${borderCol}` }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="editorial-kicker" style={{ color: textMuted }}>© {currentYear} NowyCPR.pl</div>
            <div className="text-xs font-serif italic" style={{ color: textBody }}>
              Wydawca: <span style={{ color: "white" }}>Multicert Sp. z o.o.</span> · Portal informacyjny
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
              {[
                { to: "/polityka-prywatnosci", label: "Polityka prywatności" },
                { to: "/regulamin", label: "Regulamin" },
                { to: "/kontakt", label: "Kontakt" },
                { to: "/o-portalu", label: "O portalu" },
                { to: "/dostepnosc", label: "Dostępność" },
              ].map(l => (
                <Link key={l.to} to={l.to} className="transition-colors hover:text-white" style={{ color: textMuted }}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
