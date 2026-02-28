import React, { useState } from "react";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import {
  Sparkles,
  Award,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  FileText,
  GraduationCap,
  Send,
  Building2,
  Phone,
  Mail
} from "lucide-react";

export default function Services() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    consent: false
  });

  const [formStatus, setFormStatus] = useState<null | "success" | "error">(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          subject: `Nowe zapytanie z NowyCPR.pl — ${formData.name}`,
          from_name: formData.name,
          replyto: formData.email,
          email: formData.email,
          phone: formData.phone || "—",
          company: formData.company || "—",
          message: formData.message,
          botcheck: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden pt-32">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delay"></div>
          </div>

          <Container>
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 mb-8">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">Profesjonalne usługi certyfikacyjne</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-white">Usługi certyfikacyjne </span>
                <span className="gradient-text">Multicert</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                Kompleksowe wsparcie w certyfikacji wyrobów budowlanych zgodnie z CPR (EU) 2024/3110.
                Oferujemy profesjonalną pomoc, szybką realizację i najwyższą jakość usług.
              </p>
            </div>
          </Container>
        </section>

        {/* Key Benefits */}
        <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: Clock,
                  title: "Ekspresowa certyfikacja",
                  description: "Uzyskaj certyfikat w rekordowym czasie dzięki naszym zoptymalizowanym procesom i doświadczonemu zespołowi ekspertów.",
                  gradient: "from-amber-400 to-orange-500"
                },
                {
                  icon: Users,
                  title: "Ekspercka pomoc",
                  description: "Nasi specjaliści pomogą zinterpretować przepisy i dopasować wymagania do specyfiki Twojego produktu.",
                  gradient: "from-blue-400 to-cyan-500"
                },
                {
                  icon: FlaskConical,
                  title: "Współpraca z laboratoriami",
                  description: "Korzystamy z sieci akredytowanych laboratoriów badawczych, co gwarantuje kompleksową obsługę w jednym miejscu.",
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

        {/* Services Offered */}
        <section className="py-24 bg-slate-950">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Nasze <span className="gradient-text">usługi certyfikacyjne</span>
              </h2>
              <p className="text-lg text-slate-400">
                Multicert oferuje szeroki zakres usług wspierających producentów w dostosowaniu do wymagań CPR (EU) 2024/3110.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  number: "1",
                  icon: Award,
                  title: "Certyfikacja stałości właściwości użytkowych",
                  description: "Kompleksowa ocena i certyfikacja zgodnie z systemami AVCP określonymi w CPR 2024. Obejmuje badanie typu, ocenę dokumentacji technicznej i weryfikację zakładowej kontroli produkcji.",
                  features: [
                    "Certyfikaty zgodne z systemami A+, A, B+ i B",
                    "Certyfikacja zakładowej kontroli produkcji",
                    "Okresowa ocena i nadzór nad produkcją"
                  ],
                  gradient: "from-amber-400 to-orange-500"
                },
                {
                  number: "2",
                  icon: FlaskConical,
                  title: "Badania wyrobów budowlanych",
                  description: "Kompleksowe badania laboratoryjne wyrobów budowlanych, które są niezbędne do uzyskania certyfikacji. Współpracujemy z siecią akredytowanych laboratoriów badawczych.",
                  features: [
                    "Badania typu zgodnie z normami zharmonizowanymi",
                    "Badania środowiskowe i ocena cyklu życia",
                    "Analiza składu i ocena zawartości substancji niebezpiecznych"
                  ],
                  gradient: "from-blue-400 to-cyan-500"
                },
                {
                  number: "3",
                  icon: FileText,
                  title: "Przygotowanie dokumentacji technicznej",
                  description: "Profesjonalne przygotowanie i weryfikacja dokumentacji technicznej zgodnie z nowymi wymogami CPR 2024, w tym cyfrowych deklaracji właściwości użytkowych.",
                  features: [
                    "Przygotowanie cyfrowych DoP w formacie XML",
                    "Opracowanie kart charakterystyki produktu",
                    "Przygotowanie etykiet i oznakowania CE"
                  ],
                  gradient: "from-emerald-400 to-green-500"
                },
                {
                  number: "4",
                  icon: GraduationCap,
                  title: "Doradztwo i szkolenia",
                  description: "Profesjonalne doradztwo i szkolenia z zakresu wymagań CPR 2024 dla producentów, dystrybutorów i importerów wyrobów budowlanych.",
                  features: [
                    "Konsultacje dotyczące nowych przepisów CPR 2024",
                    "Szkolenia z zakładowej kontroli produkcji",
                    "Warsztaty z przygotowania dokumentacji technicznej"
                  ],
                  gradient: "from-purple-400 to-pink-500"
                }
              ].map((service, idx) => (
                <div key={idx} className="glass-card p-8 hover-lift card-border-glow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg`}>
                      <service.icon className="w-6 h-6 text-slate-900" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
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
                Poznaj pełną ofertę usług
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Container>
        </section>

        {/* Case Studies */}
        <section className="py-24 bg-slate-900">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="gradient-text-blue">Zaufali nam</span>
              </h2>
              <p className="text-lg text-slate-400">
                Poznaj historie sukcesu firm, które skorzystały z naszych usług certyfikacyjnych.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  company: "Ceramika Budowlana S.A.",
                  year: "2023",
                  description: "Certyfikacja pełnej linii wyrobów ceramicznych zgodnie z CPR. Proces został zakończony w ciągu 4 tygodni, co pozwoliło na terminowe wprowadzenie produktów na rynek UE.",
                  quote: "Profesjonalizm i szybkość działania Multicert pozwoliły nam uniknąć opóźnień w dostawach do naszych klientów."
                },
                {
                  company: "Termo Izolacje Sp. z o.o.",
                  year: "2024",
                  description: "Kompleksowe dostosowanie dokumentacji technicznej i procedur do nowych wymogów CPR 2024. Wdrożenie systemu zakładowej kontroli produkcji zgodnego z nowymi przepisami.",
                  quote: "Dzięki wsparciu Multicert bezproblemowo przeszliśmy przez proces dostosowania do nowych przepisów CPR 2024."
                },
                {
                  company: "Stal Konstrukcje Sp.j.",
                  year: "2023",
                  description: "Pełna certyfikacja wyrobów stalowych zgodnie z systemem AVCP 2+. Przygotowanie cyfrowych deklaracji właściwości użytkowych dla całego asortymentu.",
                  quote: "Eksperci Multicert przeprowadzili nas przez złożony proces certyfikacji krok po kroku, co znacznie ułatwiło całą procedurę."
                }
              ].map((caseStudy, idx) => (
                <div key={idx} className="glass-card p-6 hover-lift">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-900" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{caseStudy.company}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-sm font-medium">{caseStudy.year}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{caseStudy.description}</p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-slate-300 text-sm italic">"{caseStudy.quote}"</p>
                  </div>
                </div>
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
                    Skontaktuj się z nami, aby omówić Twoje potrzeby związane z certyfikacją wyrobów budowlanych zgodnie z CPR 2024.
                  </p>
                </div>

                {formStatus === "success" ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Dziękujemy za wiadomość!</h3>
                    <p className="text-slate-400">Nasz ekspert skontaktuje się z Tobą w ciągu 24 godzin, aby omówić szczegóły konsultacji.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
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
                          placeholder="+48 123 456 789"
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
                        placeholder="Opisz jaką usługą certyfikacyjną jesteś zainteresowany..."
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
                        Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie lub napisz bezpośrednio na <a href="mailto:biuro@multicert.pl" className="underline">biuro@multicert.pl</a>.
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
                  <a href="tel:+48123456789" className="text-slate-400 hover:text-amber-400 transition-colors">+48 123 456 789</a>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Email</h3>
                  <a href="mailto:info@multicert.pl" className="text-slate-400 hover:text-amber-400 transition-colors">info@multicert.pl</a>
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
