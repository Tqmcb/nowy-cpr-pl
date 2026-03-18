import React, { useState, useRef } from "react";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import {
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  FileText,
  GraduationCap,
  Send,
  Building2,
  Phone,
  Mail,
  ExternalLink,
  ClipboardCheck,
  Factory,
  FolderOpen,
  Code2,
  Map,
  ShieldCheck,
  BadgeCheck
} from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Services() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    consent: false
  });
  // Honeypot — pole niewidoczne dla ludzi, boty je wypełniają
  const [honeypot, setHoneypot] = useState("");
  // Rate limit — timestamp ostatniego wysłania
  const lastSubmitRef = useRef<number>(0);

  const [formStatus, setFormStatus] = useState<null | "success" | "error">(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // MailerLite group ID for contact form (group: "Zapytania o usługi CPR")
  const ML_GROUP_CONTACT = "180852782214940193";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot — bot wypełnił ukryte pole
    if (honeypot) {
      setFormStatus("success"); // udajemy sukces, nic nie wysyłamy
      return;
    }

    // Rate limit — blokada przez 60 sekund od ostatniego wysłania
    const now = Date.now();
    if (now - lastSubmitRef.current < 60_000) {
      return;
    }
    lastSubmitRef.current = now;

    setIsSubmitting(true);

    try {
      const apiKey = import.meta.env.VITE_MAILERLITE_API_KEY;
      const headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      // 1. Dodaj subskrybenta do grupy "Zapytania o usługi CPR"
      const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: formData.email,
          fields: { name: formData.name, phone: formData.phone || "" },
          groups: [ML_GROUP_CONTACT],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const subscriberId: string = data?.data?.id;

        // 2. Dodaj notatkę z pełną treścią zapytania
        if (subscriberId) {
          const date = new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });
          const noteContent = `Zapytanie o usługę CPR 2024 (${date})\nFirma: ${formData.company || "—"}\nTelefon: ${formData.phone || "—"}\nWiadomość: ${formData.message}`;
          await fetch(`https://connect.mailerlite.com/api/subscribers/${subscriberId}/notes`, {
            method: "POST",
            headers,
            body: JSON.stringify({ content: noteContent }),
          }).catch(() => {});
        }

        // 3. Powiadomienie email do biuro@multicert.pl (formsubmit.co)
        await fetch("https://formsubmit.co/ajax/biuro@multicert.pl", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: `Nowe zapytanie o usługę CPR 2024 — ${formData.name}`,
            _template: "table",
            _captcha: "false",
            name: formData.name,
            email: formData.email,
            telefon: formData.phone || "—",
            firma: formData.company || "—",
            wiadomosc: formData.message,
          }),
        }).catch(() => {});

        setFormStatus("success");
        setFormData({ name: "", email: "", phone: "", company: "", message: "", consent: false });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      number: "01",
      icon: ClipboardCheck,
      title: "Audyt gotowości CPR 2024",
      description: "Kompleksowy przegląd luk między aktualną dokumentacją i procesami a wymaganiami CPR (UE) 2024/3110. Otrzymujesz jasny obraz co działa, co wymaga aktualizacji i w jakiej kolejności działać.",
      features: [
        "Identyfikacja właściwego systemu AVS dla każdej linii produktowej",
        "Ocena systemu ZKP/FPC względem Art. 20 CPR 2024",
        "Analiza dokumentacji: obowiązująca DoP / przyszła DoP&C, plik techniczny, instrukcje",
        "Raport z mapą ryzyk i priorytetową ścieżką wdrożenia"
      ],
      gradient: "from-amber-400 to-orange-500"
    },
    {
      number: "02",
      icon: Factory,
      title: "Przegląd systemu ZKP (Art. 20 CPR 2024)",
      description: "Ocena Zakładowej Kontroli Produkcji względem wymagań Art. 20 CPR (UE) 2024/3110 — dla wszystkich systemów AVS (1+, 1, 2+, 3, 3+, 4), w tym uproszczona wersja dla mikroprzedsiębiorstw.",
      features: [
        "Ocena Księgi ZKP i procedur operacyjnych",
        "Weryfikacja dostosowania do systemu AVS klienta",
        "Przegląd ZKP dla mikroprzedsiębiorstw (Art. 60)",
        "Wytyczne przed inspekcją jednostki notyfikowanej (NB)"
      ],
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      number: "03",
      icon: FolderOpen,
      title: "Dokumentacja techniczna CPR 2024",
      description: "Przygotowanie dokumentacji wg CPR (UE) 2024/3110 — od aktualnej DoP i szablonu przyszłej DoP&C, przez plik techniczny po instrukcje i mandaty. Uwaga: DoP&C zastępuje DoP dopiero po opublikowaniu hTS dla danej rodziny wyrobów (na marzec 2026 żadna hTS nie istnieje).",
      features: [
        "Szablon DoP (obowiązująca) i DoP&C (po publikacji hTS) — Art. 15",
        "Wewnętrzny plik techniczny — Art. 22 ust. 3",
        "Instrukcja dla użytkowników profesjonalnych — Art. 9",
        "Mandat upoważnionego przedstawiciela — Art. 23"
      ],
      gradient: "from-emerald-400 to-green-500"
    },
    {
      number: "04",
      icon: Code2,
      title: "Weryfikacja i walidacja oprogramowania obliczeniowego",
      description: "Ocena oprogramowania stosowanego do obliczeń normowych (Eurokody, normy termiczne, ogniowe, akustyczne). Raport walidacyjny stanowi element pliku technicznego Art. 22 ust. 3 i jest dowodem poprawności deklarowanych właściwości użytkowych.",
      features: [
        "Weryfikacja algorytmów vs normy zharmonizowane",
        "Walidacja wyników vs deklarowane właściwości w DoP&C",
        "Ocena oprogramowania własnego i zewnętrznego (BIM, CAD, kalkulatory)",
        "Raport walidacyjny do pliku technicznego"
      ],
      gradient: "from-purple-400 to-violet-500"
    },
    {
      number: "05",
      icon: Map,
      title: "Analiza norm i harmonogram wdrożenia",
      description: "Identyfikacja obowiązujących norm hEN (CPR 305/2011) dla wyrobów klienta i opracowanie harmonogramu dostosowania do CPR 2024 — z uwzględnieniem Planu Prac KE i etapów publikacji przyszłych hTS (Milestones 0–IV, przewidywane 2027–2029).",
      features: [
        "Przyporządkowanie obowiązujących norm hEN do produktów klienta",
        "Śledzenie etapów Milestones 0–IV wg Planu Prac KE",
        "Plan działań z konkretnymi datami przejściowymi",
        "Monitoring zmian w Dzienniku Urzędowym UE (usługa ciągła)"
      ],
      gradient: "from-rose-400 to-pink-500"
    },
    {
      number: "06",
      icon: GraduationCap,
      title: "Szkolenia i warsztaty CPR 2024",
      description: "Praktyczne szkolenia dostosowane do roli uczestnika — od zarządu przez dział jakości po produkcję. Prowadzone przez audytorów Multicert z bezpośrednim doświadczeniem we wdrożeniach CPR.",
      features: [
        "CPR 2024 dla zarządu i kierowników — co się zmienia, terminy, ryzyka",
        "Warsztat DoP&C — jak wypełnić, SVHC, QR kod, dostęp cyfrowy",
        "ZKP dla działu jakości i produkcji — praktyczny przegląd wymagań",
        "Cyfrowy Paszport Produktu — planowanie wdrożenia (Art. 75–80)"
      ],
      gradient: "from-teal-400 to-cyan-500"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Usługi Certyfikacyjne CPR 2024/3110 — Multicert | NowyCPR.pl</title>
        <meta name="description" content="Certyfikacja ZKP, weryfikacja DoP&C, przegląd dokumentacji technicznej i audyty zgodności z CPR 2024/3110. Multicert — akredytowana jednostka certyfikująca wyroby budowlane." />
        <meta property="og:title" content="Usługi Certyfikacyjne CPR 2024/3110 — Multicert" />
        <meta property="og:description" content="Certyfikacja ZKP, DoP&C, audyty CPR 2024/3110 — Multicert, akredytowana NB w Polsce." />
        <meta property="og:url" content="https://www.nowycpr.pl/services" />
        <link rel="canonical" href="https://www.nowycpr.pl/services" />
      </Helmet>
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden pt-32">
          {/* Hero Photo Background */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/images/hero-bg.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center opacity-[0.28]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/50 to-slate-900/70"></div>
          </div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delay"></div>
          </div>

          <Container>
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 mb-8">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">Przygotowanie do CPR (UE) 2024/3110</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-white">Usługi techniczne i audytowe </span>
                <span className="gradient-text">Multicert</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                Nowe Rozporządzenie CPR 2024/3110 wchodzi w życie etapami od 2025 roku. Audytorzy{" "}
                <a
                  href="https://www.multicert.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
                >
                  Multicert
                </a>{" "}
                pomagają producentom, importerom i dystrybutorom wyrobów budowlanych przejść przez ten proces sprawnie i bez ryzyka.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="group"
                >
                  Umów bezpłatną konsultację
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Key Benefits */}
        <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: BadgeCheck,
                  title: "Audytorzy z praktyką",
                  description: "Usługi realizują certyfikowani audytorzy Multicert z bezpośrednim doświadczeniem w ocenie wyrobów budowlanych i weryfikacji dokumentacji technicznej.",
                  gradient: "from-amber-400 to-orange-500"
                },
                {
                  icon: Users,
                  title: "Indywidualne podejście",
                  description: "Każde wdrożenie jest inne — analizujemy konkretne wyroby, systemy AVS i strukturę przedsiębiorstwa, a nie przykładamy ogólnych szablonów.",
                  gradient: "from-blue-400 to-cyan-500"
                },
                {
                  icon: ShieldCheck,
                  title: "Kompletne wsparcie",
                  description: "Od audytu gotowości, przez dokumentację i ZKP, po walidację oprogramowania i szkolenia — cały zakres przygotowania w jednym miejscu.",
                  gradient: "from-emerald-400 to-green-500"
                }
              ].map((item, idx) => (
                <div key={idx} className="glass-card p-8 hover-lift card-border-glow text-center group">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <item.icon className="w-8 h-8 text-slate-900" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Services */}
        <section className="py-24 bg-slate-950">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Nasze <span className="gradient-text">usługi CPR 2024</span>
              </h2>
              <p className="text-lg text-slate-400">
                Realizowane przez audytorów Multicert — dla producentów, importerów i dystrybutorów wyrobów budowlanych przygotowujących się do wymagań CPR (UE) 2024/3110.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {services.map((service, idx) => (
                <div key={idx} className="glass-card p-8 hover-lift card-border-glow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <service.icon className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-slate-500 block mb-0.5">{service.number}</span>
                      <h3 className="text-xl font-bold text-white leading-tight">{service.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-400 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
                className="group"
              >
                Zapytaj o wycenę
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Container>
        </section>

        {/* Dla kogo */}
        <section className="py-16 bg-slate-900">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="glass-card p-8 md:p-12">
                <div className="flex items-start gap-6 flex-col md:flex-row">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-7 h-7 text-slate-900" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      Dlaczego teraz — zanim pojawi się certyfikacja
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                      CPR (UE) 2024/3110 wchodzi w życie etapami. Od 8 stycznia 2026 r. obowiązują główne przepisy, ale stary format DoP (305/2011) pozostaje ważny — do czasu przyjęcia nowej normy zharmonizowanej dla danej rodziny wyrobów. Nowy format DoP&C staje się obowiązkowy osobno dla każdej rodziny, co będzie następować sukcesywnie w latach 2026–2029+. Certyfikacja jednostek notyfikowanych pod nowe rozporządzenie dopiero się kształtuje. Obowiązki w zakresie SVHC, zmienione wymagania ZKP i przepisy dotyczące pliku technicznego wchodzą niezależnie od terminu przejścia na nowy format DoP&C.
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      Firmy, które zaczną przygotowanie teraz, unikną chaosu ostatniej chwili, kosztownych błędów w dokumentacji i ryzyk związanych z nadzorem rynku. Usługi Multicert są właśnie pod to przygotowanie — pragmatyczne, oparte na tekście rozporządzenia i prowadzone przez praktyków.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: "Producenci wyrobów budowlanych", desc: "każda kategoria i system AVS" },
                        { label: "Importerzy i dystrybutorzy", desc: "sprowadzający wyroby pod własną marką" },
                        { label: "Mikroprzedsiębiorstwa i MŚP", desc: "uproszczone ścieżki wdrożenia" }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
                          <p className="text-slate-400 text-xs">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Partnerzy */}
        <section className="py-12 bg-slate-950 border-t border-white/5">
          <Container>
            <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-8">
              Działamy we współpracy z akredytowanymi jednostkami certyfikującymi
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {[
                { name: "Multicert Sp. z o.o.", url: "https://www.multicert.pl" },
                { name: "ITC Zlín", url: "https://www.itczlin.cz" },
                { name: "LL-C", url: "https://www.ll-c.com.pl" },
                { name: "ZDZ Cert (NB 1388)", url: "https://www.zdzcert.pl" },
              ].map((partner) => (
                <a
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-400/30 transition-all text-sm font-medium"
                >
                  {partner.name}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              ))}
            </div>
          </Container>
        </section>

        {/* Contact Form */}
        <section id="contact-section" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card p-8 md:p-12">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Umów <span className="gradient-text">bezpłatną konsultację</span>
                  </h2>
                  <p className="text-slate-400">
                    Opisz swój wyrób i sytuację — audytor Multicert skontaktuje się z Tobą w ciągu 24 godzin, aby omówić zakres i sposób wsparcia.
                  </p>
                </div>

                {formStatus === "success" ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Dziękujemy za wiadomość!</h3>
                    <p className="text-slate-400">Nasz audytor skontaktuje się z Tobą w ciągu 24 godzin.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Honeypot — niewidoczne dla użytkowników, wypełniane przez boty */}
                    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                      <label htmlFor="website">Nie wypełniaj tego pola</label>
                      <input
                        id="website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Imię i nazwisko *</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                          placeholder="Jan Kowalski"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                          placeholder="jan@firma.pl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">Telefon</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                          placeholder="730 668 341"
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">Firma *</label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          required
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                          placeholder="Nazwa firmy"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Wiadomość *</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all resize-none"
                        placeholder="Opisz jakimi wyrobami się zajmujesz i w czym możemy pomóc..."
                      ></textarea>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-start">
                        <input
                          id="consent"
                          name="consent"
                          type="checkbox"
                          required
                          checked={formData.consent}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 mt-1 rounded border-white/20 bg-white/5 text-amber-400 focus:ring-amber-400"
                        />
                        <label htmlFor="consent" className="ml-3 block text-sm text-slate-400">
                          Wyrażam zgodę na przetwarzanie moich danych osobowych w celu udzielenia odpowiedzi na zapytanie oraz w celach marketingowych zgodnie z Polityką Prywatności. *
                        </label>
                      </div>
                    </div>

                    {formStatus === "error" && (
                      <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                        Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub napisz bezpośrednio na{" "}
                        <a href="mailto:biuro@multicert.pl" className="underline">biuro@multicert.pl</a>.
                      </div>
                    )}

                    <div className="text-center">
                      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                        <Send className="w-5 h-5 mr-2" />
                        {isSubmitting ? "Wysyłanie..." : "Wyślij zapytanie"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Telefon</h3>
                  <a href="tel:+48730668341" className="text-slate-400 hover:text-amber-400 transition-colors">730 668 341</a>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Email</h3>
                  <a href="mailto:biuro@multicert.pl" className="text-slate-400 hover:text-amber-400 transition-colors">biuro@multicert.pl</a>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Siedziba</h3>
                  <p className="text-slate-400">Multicert Sp. z o.o.</p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
