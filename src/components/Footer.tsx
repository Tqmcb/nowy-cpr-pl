import React from "react";
import { Container } from "./Container";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  Linkedin,
  Twitter,
  Facebook,
  Home,
  Search,
  FileText,
  Award,
  BookOpen,
  Shield,
  ExternalLink,
  Info
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="relative bg-gradient-to-b from-slate-900 to-slate-950 pt-20 pb-8 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

      <Container>
        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  NowyCPR
                </span>
                <span className="text-2xl font-bold text-slate-500">.pl</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Kompleksowe wsparcie dla producentów wyrobów budowlanych w kontekście Rozporządzenia CPR (EU) 2024/3110. Aktualne informacje, dokumenty i profesjonalne usługi certyfikacyjne.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/company/multicert-certyfikacja-wyrobow/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Multicert na LinkedIn (otwiera się w nowej karcie)"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400/50 hover:bg-amber-400/10 transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/multicert_pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Multicert na Twitter/X (otwiera się w nowej karcie)"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400/50 hover:bg-amber-400/10 transition-all duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/MulticertCertyfikacja"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Multicert na Facebook (otwiera się w nowej karcie)"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400/50 hover:bg-amber-400/10 transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Przydatne linki
              </h3>
              <ul className="space-y-3">
                {[
                  { path: "/", label: "Strona Główna", icon: Home },
                  { path: "/product-search", label: "Wyszukiwarka CPR", icon: Search },
                  { path: "/documents", label: "Dokumenty", icon: FileText },
                  { path: "/services", label: "Usługi certyfikacyjne", icon: Award },
                  { path: "/blog", label: "Blog", icon: BookOpen },
                  { path: "/o-portalu", label: "O portalu", icon: Info },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-slate-400 hover:text-amber-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                    >
                      <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Kontakt
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 text-slate-400">
                  <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Multicert Sp. z o.o.</p>
                    <p>Mydlarska 47</p>
                    <p>04-690 Warszawa</p>
                  </div>
                </li>
                <li>
                  <a
                    href="mailto:biuro@multicert.pl"
                    className="flex items-center gap-3 text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-amber-400" />
                    biuro@multicert.pl
                  </a>
                </li>
              </ul>

              {/* Official EU Link */}
              <div className="mt-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <a
                  href="https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32024R3110"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Oficjalny tekst CPR (EU) 2024/3110</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Newsletter
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Bądź na bieżąco z najnowszymi zmianami w przepisach CPR i terminami wdrożeń
              </p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const honeypotInput = form.querySelector('input[name="website"]') as HTMLInputElement;
                const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
                const nameInput = form.querySelector('input[id="newsletter-name"]') as HTMLInputElement;

                // Honeypot — bot wypełnił ukryte pole
                if (honeypotInput?.value) return;

                if (emailInput && emailInput.value) {
                  const name = nameInput?.value || '';
                  import('utils/newsletterHelpers').then(({ subscribeToNewsletter, validateEmail }) => {
                    if (!validateEmail(emailInput.value)) {
                      alert("Proszę podać prawidłowy adres email");
                      return;
                    }

                    subscribeToNewsletter(emailInput.value, 'footer-newsletter', name)
                      .then(success => {
                        if (success) {
                          alert("Dziękujemy za zapisanie się do newslettera!");
                          emailInput.value = '';
                          if (nameInput) nameInput.value = '';
                        } else {
                          alert("Wystąpił problem podczas zapisywania. Spróbuj ponownie.");
                        }
                      });
                  });
                }
              }}>
                <div className="space-y-3">
                  {/* Honeypot — niewidoczne dla użytkowników */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                  <label htmlFor="newsletter-name" className="sr-only">Twoje imię</label>
                  <input
                    id="newsletter-name"
                    type="text"
                    placeholder="Twoje imię"
                    className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all duration-300"
                  />
                  <label htmlFor="newsletter-email" className="sr-only">Twój e-mail</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Twój e-mail"
                    required
                    className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="w-full btn-premium py-3 rounded-xl text-sm font-semibold text-slate-900 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Zapisz się
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Twoje dane będą wykorzystane wyłącznie w celu wysyłki newslettera.
                </p>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-500 text-sm">
                © {currentYear} NowyCPR.pl. Wszystkie prawa zastrzeżone.
              </div>
              <div className="text-slate-600 text-xs">
                Wydawca: <span className="text-slate-400">Multicert Sp. z o.o.</span> | Portal informacyjny NowyCPR.pl
              </div>
              <div className="flex items-center gap-6 text-sm">
                <Link to="/polityka-prywatnosci" className="text-slate-500 hover:text-amber-400 transition-colors duration-300">
                  Polityka prywatności
                </Link>
                <Link to="/regulamin" className="text-slate-500 hover:text-amber-400 transition-colors duration-300">
                  Regulamin
                </Link>
                <Link to="/kontakt" className="text-slate-500 hover:text-amber-400 transition-colors duration-300">
                  Kontakt
                </Link>
                <Link to="/o-portalu" className="text-slate-500 hover:text-amber-400 transition-colors duration-300">O portalu</Link>
                <Link to="/dostepnosc" className="text-slate-500 hover:text-amber-400 transition-colors duration-300">Dostępność</Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
