import React from "react";
import { Container } from "./Container";
import { Link } from "react-router-dom";
import { MapPin, Mail, Send, Linkedin, Twitter, Facebook, Home, Search, FileText, Award, BookOpen, Shield, ExternalLink, Info } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-[#0d2137] border-t border-slate-700 pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="text-xl font-bold text-white">NowyCPR</span>
              <span className="text-xl font-bold text-slate-500">.pl</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Kompleksowe wsparcie dla producentów wyrobów budowlanych w kontekście Rozporządzenia CPR (EU) 2024/3110. Portal wydawany przez Multicert Sp. z o.o.
            </p>
            <div className="flex gap-2">
              {[
                { href: "https://www.linkedin.com/company/multicert-certyfikacja-wyrobow/", label: "LinkedIn", Icon: Linkedin },
                { href: "https://twitter.com/multicert_pl", label: "Twitter", Icon: Twitter },
                { href: "https://www.facebook.com/MulticertCertyfikacja", label: "Facebook", Icon: Facebook },
              ].map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Multicert na ${label}`}
                  className="w-9 h-9 rounded border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Linki */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 pb-2 border-b border-slate-700">Przydatne linki</h3>
            <ul className="space-y-2.5">
              {[
                { path: "/", label: "Strona Główna", icon: Home },
                { path: "/product-search", label: "Wyszukiwarka CPR", icon: Search },
                { path: "/documents", label: "Dokumenty", icon: FileText },
                { path: "/services", label: "Usługi certyfikacyjne", icon: Award },
                { path: "/blog", label: "Blog", icon: BookOpen },
                { path: "/o-portalu", label: "O portalu", icon: Info },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <link.icon className="w-3.5 h-3.5" />{link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 pb-2 border-b border-slate-700">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Multicert Sp. z o.o.</p>
                  <p>Mydlarska 47, 04-690 Warszawa</p>
                </div>
              </li>
              <li>
                <a href="mailto:biuro@multicert.pl" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />biuro@multicert.pl
                </a>
              </li>
            </ul>
            <div className="mt-5 p-3 rounded border border-blue-800 bg-blue-950/30">
              <a href="https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32024R3110" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                <Shield className="w-3.5 h-3.5" />
                <span>Oficjalny tekst CPR (EU) 2024/3110</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 pb-2 border-b border-slate-700">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">Bądź na bieżąco ze zmianami w przepisach CPR i terminami wdrożeń</p>
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
                  className="w-full px-3 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors" />
                <label htmlFor="newsletter-email" className="sr-only">Twój e-mail</label>
                <input id="newsletter-email" type="email" placeholder="Twój e-mail" required
                  className="w-full px-3 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors" />
                <button type="submit" className="w-full py-2.5 rounded text-sm font-semibold text-white bg-[#1a56a0] hover:bg-[#1a3d6b] transition-colors flex items-center justify-center gap-2">
                  <Send className="w-3.5 h-3.5" />Zapisz się
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-2">Twoje dane będą użyte wyłącznie do wysyłki newslettera.</p>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-slate-500 text-xs">© {currentYear} NowyCPR.pl. Wszystkie prawa zastrzeżone.</div>
            <div className="text-slate-600 text-xs">Wydawca: <span className="text-slate-400">Multicert Sp. z o.o.</span> | Portal informacyjny</div>
            <div className="flex items-center gap-5 text-xs">
              {[
                { to: "/polityka-prywatnosci", label: "Polityka prywatności" },
                { to: "/regulamin", label: "Regulamin" },
                { to: "/kontakt", label: "Kontakt" },
                { to: "/o-portalu", label: "O portalu" },
                { to: "/dostepnosc", label: "Dostępność" },
              ].map(l => (
                <Link key={l.to} to={l.to} className="text-slate-500 hover:text-slate-300 transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
