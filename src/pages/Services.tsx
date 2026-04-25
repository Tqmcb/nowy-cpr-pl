import React, { useState, useRef } from "react";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHeader, RelatedPages } from "../components/PageHeader";
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
      // 1. Powiadomienie email do biuro@multicert.pl (formsubmit.co) — PRIORYTET
      const emailRes = await fetch("https://formsubmit.co/ajax/biuro@multicert.pl", {
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
      });

      // 2. MailerLite — opcjonalnie, nie blokuje sukcesu
      try {
        const apiKey = import.meta.env.VITE_MAILERLITE_API_KEY;
        if (apiKey) {
          const headers = {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          };
          const mlRes = await fetch("https://connect.mailerlite.com/api/subscribers", {
            method: "POST",
            headers,
            body: JSON.stringify({
              email: formData.email,
              fields: { name: formData.name, phone: formData.phone || "" },
              groups: [ML_GROUP_CONTACT],
            }),
          });
          if (mlRes.ok) {
            const data = await mlRes.json();
            const subscriberId: string = data?.data?.id;
            if (subscriberId) {
              const date = new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });
              const noteContent = `Zapytanie o usługę CPR 2024 (${date})\nFirma: ${formData.company || "—"}\nTelefon: ${formData.phone || "—"}\nWiadomość: ${formData.message}`;
              await fetch(`https://connect.mailerlite.com/api/subscribers/${subscriberId}/notes`, {
                method: "POST",
                headers,
                body: JSON.stringify({ content: noteContent }),
              }).catch(() => {});
            }
          }
        }
      } catch { /* MailerLite failure doesn't block success */ }

      if (emailRes.ok) {
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Certyfikacja wyrobów budowlanych CPR, ZKP i DoP&C — Multicert | NowyCPR.pl</title>
        <meta name="description" content="Certyfikacja wyrobów budowlanych, audyt ZKP/FPC, weryfikacja DoP&C, oznakowanie CE i przegląd dokumentacji technicznej pod CPR 2024/3110." />
        <meta name="keywords" content="certyfikacja wyrobów budowlanych, certyfikacja CPR, audyt ZKP, audyt FPC, weryfikacja DoP&C, oznakowanie CE, jednostka certyfikująca wyroby budowlane" />
        <meta property="og:title" content="Certyfikacja wyrobów budowlanych CPR, ZKP i DoP&C — Multicert" />
        <meta property="og:description" content="Certyfikacja CPR, audyty ZKP/FPC, DoP&C, CE i dokumentacja techniczna dla producentów wyrobów budowlanych." />
        <meta property="og:url" content="https://www.nowycpr.pl/services/" />
        <link rel="canonical" href="https://www.nowycpr.pl/services/" />
      </Helmet>
      <Header />

      <main className="flex-grow bg-white">
        <PageHeader>
          <Button
            size="lg"
            onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
            className="group text-white font-semibold px-8 py-4 whitespace-nowrap transition-all"
            style={{ backgroundColor: "oklch(20% .03 264)", borderRadius: "2px" }}
          >
            Umów bezpłatną konsultację
            <ArrowRight className="w-4 h-4 ml-2 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Button>
        </PageHeader>

        {/* Key Benefits — editorial three-column */}
        <section className="pt-4 pb-10 md:pt-6 md:pb-12 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-baseline gap-4 mb-6 pb-4" style={{ borderBottom: "2px solid oklch(20% .03 264)" }}>
                <span className="editorial-numeral text-3xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>—</span>
                <h2 className="font-serif text-2xl md:text-3xl" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                  Co nas <span className="italic" style={{ color: "oklch(55% .22 27)" }}>wyróżnia</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
                {[
                  { icon: BadgeCheck, title: "Audytorzy z praktyką", description: "Usługi realizują certyfikowani audytorzy Multicert z bezpośrednim doświadczeniem w ocenie wyrobów budowlanych i weryfikacji dokumentacji technicznej." },
                  { icon: Users, title: "Indywidualne podejście", description: "Każde wdrożenie jest inne — analizujemy konkretne wyroby, systemy AVS i strukturę przedsiębiorstwa, a nie przykładamy ogólnych szablonów." },
                  { icon: ShieldCheck, title: "Kompletne wsparcie", description: "Od audytu gotowości, przez dokumentację i ZKP, po walidację oprogramowania i szkolenia — cały zakres przygotowania w jednym miejscu." }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 md:p-10" style={{
                    borderRight: idx < 2 ? "1px solid oklch(92% .008 264)" : "none",
                    borderBottom: "1px solid oklch(92% .008 264)"
                  }}>
                    <div className="flex items-start justify-between mb-6">
                      <span className="editorial-numeral text-4xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>{String(idx + 1).padStart(2, "0")}</span>
                      <item.icon className="w-6 h-6" style={{ color: "oklch(20% .03 264)" }} />
                    </div>
                    <h3 className="font-serif text-2xl mb-4 leading-[1.15]" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>{item.title}</h3>
                    <p className="text-sm leading-[1.65]" style={{ color: "oklch(42% .02 264)" }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Services list — editorial */}
        <section className="py-10 md:py-12" style={{ backgroundColor: "oklch(98% .005 264)" }}>
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-baseline gap-6 mb-8">
                <span className="editorial-numeral text-6xl md:text-7xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>—</span>
                <div className="flex items-center gap-3 pt-4">
                  <div className="h-[2px] w-10" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                  <span className="editorial-kicker">Katalog usług</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10">
                <h2 className="lg:col-span-8 font-serif text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1]" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                  Nasze usługi<br/>
                  <span className="italic" style={{ color: "oklch(55% .22 27)", fontWeight: 500 }}>CPR 2024</span>
                </h2>
                <p className="lg:col-span-4 text-base md:text-lg leading-[1.6]" style={{ color: "oklch(42% .02 264)" }}>
                  Realizowane przez audytorów Multicert — dla producentów, importerów i dystrybutorów wyrobów budowlanych.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ borderTop: "2px solid oklch(20% .03 264)" }}>
                {services.map((service, idx) => (
                  <div key={idx} className="p-6 md:p-10 transition-all hover:bg-white" style={{
                    borderRight: idx % 2 === 0 ? "1px solid oklch(92% .008 264)" : "none",
                    borderBottom: "1px solid oklch(92% .008 264)",
                    backgroundColor: "white"
                  }}>
                    <div className="flex items-start justify-between mb-5">
                      <span className="editorial-numeral text-4xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>{service.number}</span>
                      <service.icon className="w-5 h-5" style={{ color: "oklch(20% .03 264)" }} />
                    </div>
                    <h3 className="font-serif text-2xl md:text-[1.75rem] mb-4 leading-[1.15]" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>{service.title}</h3>
                    <p className="text-sm leading-[1.65] mb-5" style={{ color: "oklch(42% .02 264)" }}>{service.description}</p>
                    <ul className="space-y-2.5">
                      {service.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-2.5 text-sm" style={{ color: "oklch(42% .02 264)" }}>
                          <span className="mt-1.5 w-1 h-1 flex-shrink-0" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-start">
                <Button
                  size="lg"
                  onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="group text-white font-semibold px-8 py-4 whitespace-nowrap transition-all"
                  style={{ backgroundColor: "oklch(20% .03 264)", borderRadius: "2px" }}
                >
                  Zapytaj o wycenę
                  <ArrowRight className="w-4 h-4 ml-2 shrink-0 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Pull quote — Dlaczego teraz */}
        <section className="py-12 md:py-14 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="relative py-10 md:py-14" style={{ borderTop: "2px solid oklch(20% .03 264)", borderBottom: "1px solid oklch(86% .012 264)" }}>
                <div className="editorial-kicker absolute -top-3 left-0 bg-white pr-4">Dlaczego teraz</div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7">
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] mb-6" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                      Zanim pojawi się<br/>
                      <span className="italic" style={{ color: "oklch(55% .22 27)" }}>certyfikacja obowiązkowa</span>.
                    </h2>
                  </div>
                  <div className="lg:col-span-5 lg:border-l lg:pl-8" style={{ borderColor: "oklch(86% .012 264)" }}>
                    <p className="text-base leading-[1.7] mb-4" style={{ color: "oklch(42% .02 264)" }}>
                      CPR (UE) 2024/3110 wchodzi w życie etapami. Od 8 stycznia 2026 r. obowiązują główne przepisy, ale stary format DoP (305/2011) pozostaje ważny — do czasu przyjęcia nowej hTS dla danej rodziny wyrobów.
                    </p>
                    <p className="text-base leading-[1.7]" style={{ color: "oklch(42% .02 264)" }}>
                      Firmy, które <strong style={{ color: "oklch(55% .22 27)", fontWeight: 600 }}>zaczną przygotowanie teraz</strong>, unikną chaosu ostatniej chwili i kosztownych błędów w dokumentacji.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dla kogo — 3 grupy */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-16" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
                {[
                  { label: "Producenci wyrobów budowlanych", desc: "każda kategoria i system AVS" },
                  { label: "Importerzy i dystrybutorzy", desc: "sprowadzający wyroby pod własną marką" },
                  { label: "Mikroprzedsiębiorstwa i MŚP", desc: "uproszczone ścieżki wdrożenia" }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 md:p-6" style={{
                    borderRight: idx < 2 ? "1px solid oklch(92% .008 264)" : "none",
                    borderBottom: "1px solid oklch(92% .008 264)"
                  }}>
                    <span className="editorial-numeral text-3xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h4 className="font-serif text-lg md:text-xl mt-3 mb-2 leading-[1.2]" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>{item.label}</h4>
                    <p className="text-sm leading-[1.5]" style={{ color: "oklch(60% .015 264)" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Partnerzy — editorial */}
        <section className="py-14" style={{ backgroundColor: "oklch(98% .005 264)" }}>
          <Container>
            <div className="max-w-6xl mx-auto">
              <p className="editorial-kicker text-center mb-8" style={{ color: "oklch(60% .015 264)" }}>
                Działamy we współpracy z akredytowanymi jednostkami certyfikującymi
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4">
                {[
                  { name: "Multicert Sp. z o.o.", url: "https://www.multicert.pl" },
                  { name: "ITC Zlín", url: "https://www.itczlin.cz" },
                  { name: "LL-C", url: "https://www.ll-c.com.pl" },
                  { name: "ZDZ Cert (NB 1388)", url: "https://www.zdzcert.pl" },
                ].map((partner) => (
                  <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-5 py-2.5 font-serif text-sm transition-all hover:bg-white"
                    style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px", color: "oklch(20% .03 264)" }}>
                    {partner.name}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Contact Form — editorial */}
        <section id="contact-section" className="py-12 md:py-16 bg-white">
          <Container>
            <div className="max-w-5xl mx-auto">
              <div className="flex items-baseline gap-6 mb-6">
                <span className="editorial-numeral text-6xl md:text-7xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>—</span>
                <div className="flex items-center gap-3 pt-4">
                  <div className="h-[2px] w-10" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                  <span className="editorial-kicker">Zapytanie</span>
                </div>
              </div>
              <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1] mb-4" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                Umów<br/>
                <span className="italic" style={{ color: "oklch(55% .22 27)", fontWeight: 500 }}>bezpłatną konsultację</span>
              </h2>
              <p className="text-base md:text-lg leading-[1.6] mb-8 max-w-2xl" style={{ color: "oklch(42% .02 264)" }}>
                Opisz swój wyrób i sytuację — audytor Multicert skontaktuje się w ciągu 24 godzin.
              </p>

              <div className="pt-12" style={{ borderTop: "2px solid oklch(20% .03 264)" }}>
                {formStatus === "success" ? (
                  <div className="py-12">
                    <CheckCircle2 className="w-10 h-10 mb-4" style={{ color: "oklch(55% .14 155)" }} />
                    <h3 className="font-serif text-2xl mb-2" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>Dziękujemy za wiadomość.</h3>
                    <p style={{ color: "oklch(42% .02 264)" }}>Nasz audytor skontaktuje się z Tobą w ciągu 24 godzin.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="max-w-2xl">
                    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                      <label htmlFor="website">Nie wypełniaj tego pola</label>
                      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="editorial-kicker block mb-2" style={{ color: "oklch(20% .03 264)" }}>Imię i nazwisko *</label>
                        <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white focus:outline-none transition-all font-serif"
                          style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px", color: "oklch(20% .03 264)" }}
                          placeholder="Jan Kowalski" />
                      </div>
                      <div>
                        <label htmlFor="email" className="editorial-kicker block mb-2" style={{ color: "oklch(20% .03 264)" }}>Email *</label>
                        <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white focus:outline-none transition-all font-serif"
                          style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px", color: "oklch(20% .03 264)" }}
                          placeholder="jan@firma.pl" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="phone" className="editorial-kicker block mb-2" style={{ color: "oklch(20% .03 264)" }}>Telefon</label>
                        <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white focus:outline-none transition-all font-serif"
                          style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px", color: "oklch(20% .03 264)" }}
                          placeholder="730 668 341" />
                      </div>
                      <div>
                        <label htmlFor="company" className="editorial-kicker block mb-2" style={{ color: "oklch(20% .03 264)" }}>Firma *</label>
                        <input id="company" name="company" type="text" required value={formData.company} onChange={handleChange}
                          className="w-full px-4 py-3 bg-white focus:outline-none transition-all font-serif"
                          style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px", color: "oklch(20% .03 264)" }}
                          placeholder="Nazwa firmy" />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="editorial-kicker block mb-2" style={{ color: "oklch(20% .03 264)" }}>Wiadomość *</label>
                      <textarea id="message" name="message" required rows={4} value={formData.message} onChange={handleChange}
                        className="w-full px-4 py-3 bg-white focus:outline-none transition-all font-serif resize-none"
                        style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px", color: "oklch(20% .03 264)" }}
                        placeholder="Opisz jakimi wyrobami się zajmujesz i w czym możemy pomóc..."></textarea>
                    </div>

                    <div className="mb-8 flex items-start">
                      <input id="consent" name="consent" type="checkbox" required checked={formData.consent} onChange={handleCheckboxChange}
                        className="h-4 w-4 mt-1" style={{ accentColor: "oklch(55% .22 27)" }} />
                      <label htmlFor="consent" className="ml-3 block text-sm leading-[1.5]" style={{ color: "oklch(42% .02 264)" }}>
                        Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z Polityką Prywatności. *
                      </label>
                    </div>

                    {formStatus === "error" && (
                      <div className="mb-6 p-4 text-sm" style={{ borderLeft: "2px solid oklch(55% .22 27)", color: "oklch(42% .02 264)", backgroundColor: "oklch(98% .005 264)" }}>
                        Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub napisz bezpośrednio na{" "}
                        <a href="mailto:biuro@multicert.pl" className="underline" style={{ color: "oklch(55% .22 27)" }}>biuro@multicert.pl</a>.
                      </div>
                    )}

                    <Button type="submit" size="lg" disabled={isSubmitting}
                      className="text-white font-semibold px-8 py-4 transition-all disabled:opacity-50"
                      style={{ backgroundColor: "oklch(20% .03 264)", borderRadius: "2px" }}>
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Wysyłanie..." : "Wyślij zapytanie"}
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact Info — editorial row */}
              <div className="mt-20 pt-12 grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
                {[
                  { icon: Phone, label: "Telefon", value: "730 668 341", href: "tel:+48730668341" },
                  { icon: Mail, label: "Email", value: "biuro@multicert.pl", href: "mailto:biuro@multicert.pl" },
                  { icon: Building2, label: "Siedziba", value: "Multicert Sp. z o.o." },
                ].map((item, idx) => (
                  <div key={idx} className="p-6" style={{
                    borderRight: idx < 2 ? "1px solid oklch(92% .008 264)" : "none"
                  }}>
                    <div className="flex items-center gap-3 mb-3">
                      <item.icon className="w-4 h-4" style={{ color: "oklch(55% .22 27)" }} />
                      <span className="editorial-kicker">{item.label}</span>
                    </div>
                    {item.href ? (
                      <a href={item.href} className="font-serif text-xl transition-colors hover:italic" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>{item.value}</a>
                    ) : (
                      <p className="font-serif text-xl italic" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <RelatedPages />
      <Footer />
    </div>
  );
}
