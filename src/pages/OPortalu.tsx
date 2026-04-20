import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { PageHeader, RelatedPages } from "../components/PageHeader";
import { Info, Shield, Users, FileText, Award, Mail } from "lucide-react";

export default function OPortalu() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>O portalu NowyCPR.pl — Rozporządzenie CPR 2024/3110</title>
        <meta name="description" content="Dowiedz się więcej o portalu NowyCPR.pl — kompleksowym źródle wiedzy o rozporządzeniu CPR (EU) 2024/3110 dla producentów wyrobów budowlanych." />
      </Helmet>
      <Header />
      <main id="main-content" className="pb-20">
        <PageHeader />
        <Container>
          <div className="max-w-3xl mx-auto space-y-8 pt-12">

            {/* Mission */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
              <h2 className="text-xl font-bold text-[oklch(20% .03 264)] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55% .22 27)]/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[oklch(55% .22 27)]" />
                </span>
                Misja portalu
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Portal NowyCPR.pl powstał z myślą o polskich producentach, importerach i dystrybutorach
                wyrobów budowlanych, którzy muszą dostosować się do nowych wymagań Rozporządzenia
                Parlamentu Europejskiego i Rady (EU) 2024/3110 w sprawie wyrobów budowlanych.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Naszym celem jest dostarczenie rzetelnych, aktualnych i praktycznych informacji,
                które pomogą firmom przejść przez proces dostosowania do nowych przepisów
                sprawnie i bez zbędnych kosztów.
              </p>
            </section>

            {/* What we offer */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
              <h2 className="text-xl font-bold text-[oklch(20% .03 264)] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55% .22 27)]/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[oklch(55% .22 27)]" />
                </span>
                Co oferuje portal
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Wyszukiwarka CPR",
                    desc: "Interaktywna wyszukiwarka wymagań CPR dla 36 kategorii wyrobów budowlanych — sprawdź wymagania dla swojego produktu w kilka sekund.",
                  },
                  {
                    title: "Baza dokumentów",
                    desc: "Aktualny zbiór norm zharmonizowanych, aktów delegowanych, wytycznych Komisji Europejskiej i innych dokumentów związanych z CPR 2024.",
                  },
                  {
                    title: "Blog ekspercki",
                    desc: "Artykuły napisane przez inżynierów i specjalistów ds. certyfikacji, omawiające praktyczne aspekty wdrożenia CPR 2024/3110.",
                  },
                  {
                    title: "Usługi certyfikacyjne",
                    desc: "Profesjonalne wsparcie w procesie uzyskania oznakowania CE, przygotowania dokumentacji technicznej i Deklaracji Właściwości Użytkowych.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-[oklch(55% .22 27)] mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-[oklch(20% .03 264)] font-semibold mb-1">{item.title}</p>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Publisher */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
              <h2 className="text-xl font-bold text-[oklch(20% .03 264)] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55% .22 27)]/10 flex items-center justify-center">
                  <Award className="w-4 h-4 text-[oklch(55% .22 27)]" />
                </span>
                Wydawca portalu
              </h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                Portal NowyCPR.pl jest prowadzony przez <span className="text-[oklch(20% .03 264)] font-semibold">Multicert Sp. z o.o.</span> —
                polską jednostkę certyfikującą i laboratorium badawcze specjalizujące się
                w certyfikacji wyrobów budowlanych i potwierdzaniu zgodności z wymaganiami CPR.
              </p>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-2">
                <p className="text-[oklch(20% .03 264)] font-semibold">Multicert Sp. z o.o.</p>
                <p className="text-slate-500">ul. Mydlarska 47, 04-690 Warszawa</p>
                <p className="text-slate-500">
                  E-mail:{" "}
                  <a href="mailto:biuro@multicert.pl" className="text-[oklch(55% .22 27)] hover:text-[#1a3d6b] transition-colors">
                    biuro@multicert.pl
                  </a>
                </p>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-xl font-bold text-[oklch(20% .03 264)] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-[oklch(55% .22 27)]" />
                </span>
                Informacja prawna
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm">
                Treści publikowane na portalu NowyCPR.pl mają charakter informacyjny i edukacyjny.
                Nie stanowią porady prawnej ani technicznej w rozumieniu przepisów prawa.
                Przed podjęciem decyzji biznesowych zalecamy konsultację z właściwymi ekspertami
                lub jednostkami notyfikowanymi. Rozporządzenie CPR (EU) 2024/3110 jest dokumentem
                prawnym — w przypadku wątpliwości interpretacyjnych wiążący jest tekst opublikowany
                w Dzienniku Urzędowym Unii Europejskiej.
              </p>
            </section>

          </div>
        </Container>
      </main>
      <RelatedPages />
      <Footer />
    </div>
  );
}
