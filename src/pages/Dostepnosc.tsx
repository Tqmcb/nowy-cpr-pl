import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Accessibility, CheckCircle, AlertCircle, Mail } from "lucide-react";

export default function Dostepnosc() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <Helmet>
        <title>Deklaracja dostępności — NowyCPR.pl</title>
        <meta name="description" content="Deklaracja dostępności cyfrowej portalu NowyCPR.pl zgodnie z ustawą z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych." />
      </Helmet>
      <Header />
      <main id="main-content" className="pt-24 pb-20">
        <Container>
          {/* Page header */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[oklch(55%_.22_27/0.1)] border border-[oklch(55%_.22_27/0.2)] mb-6">
              <Accessibility className="w-4 h-4 text-[oklch(75%_.15_27)]" />
              <span className="text-[oklch(75%_.15_27)] text-sm font-medium">Dostępność cyfrowa</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Deklaracja dostępności
            </h1>
            <p className="text-slate-400">
              Data sporządzenia: <span className="text-slate-300 font-medium">8 stycznia 2026 r.</span>
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">

            {/* Introduction */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <p className="text-slate-300 leading-relaxed mb-4">
                <span className="text-white font-semibold">Multicert Sp. z o.o.</span> zobowiązuje się zapewnić dostępność
                portalu <span className="text-white font-semibold">NowyCPR.pl</span> zgodnie
                z obowiązującymi standardami dostępności cyfrowej.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Niniejsza deklaracja dostępności dotyczy serwisu internetowego dostępnego
                pod adresem{" "}
                <a href="https://www.nowycpr.pl" className="text-[oklch(75%_.15_27)] hover:text-white transition-colors">
                  www.nowycpr.pl
                </a>.
              </p>
            </section>

            {/* Status */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[oklch(75%_.15_27)]" />
                </span>
                Status dostępności
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Portal NowyCPR.pl jest <span className="text-white font-semibold">częściowo zgodny</span> ze
                standardem WCAG 2.1 na poziomie AA.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Poniżej wymieniono znane ograniczenia dostępności i podjęte działania naprawcze.
              </p>
            </section>

            {/* Compliances */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[oklch(75%_.15_27)]" />
                </span>
                Dostępne elementy
              </h2>
              <ul className="space-y-3 text-slate-300 text-sm leading-relaxed">
                {[
                  "Strona posiada logiczną strukturę nagłówków (H1–H3)",
                  "Nawigacja klawiaturą jest możliwa na całej stronie",
                  "Obrazy posiadają atrybuty alt opisujące ich zawartość",
                  "Strona stosuje odpowiedni kontrast kolorów (minimum 4,5:1)",
                  "Strona posiada mechanizm pominięcia nawigacji (link «Przejdź do treści głównej»)",
                  "Formularze posiadają opisane etykiety pól",
                  "Strona poprawnie skaluje się przy powiększeniu do 200%",
                  "Język strony jest zadeklarowany w znaczniku HTML (lang=\"pl\")",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle className="w-4 h-4 text-[oklch(75%_.15_27)] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Known issues */}
            <section className="rounded-2xl border border-[oklch(55%_.22_27/0.2)] bg-[oklch(55%_.22_27/0.05)] p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-[oklch(75%_.15_27)]" />
                </span>
                Znane ograniczenia
              </h2>
              <ul className="space-y-3 text-slate-300 text-sm leading-relaxed">
                {[
                  "Niektóre pliki PDF w bazie dokumentów mogą nie być w pełni dostępne — są to dokumenty zewnętrzne (normy, akty prawne UE), na których dostępność nie mamy wpływu.",
                  "Wbudowane infografiki mogą nie być w pełni opisane tekstem alternatywnym.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <AlertCircle className="w-4 h-4 text-[oklch(75%_.15_27)] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Feedback */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[oklch(75%_.15_27)]" />
                </span>
                Zgłaszanie problemów z dostępnością
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                W przypadku napotkania problemów z dostępnością cyfrową portalu prosimy
                o kontakt:
              </p>
              <div className="rounded-xl bg-slate-800/60 border border-white/10 p-5 space-y-2">
                <p className="text-white font-semibold">Multicert Sp. z o.o.</p>
                <p className="text-slate-400">ul. Mydlarska 47, 04-690 Warszawa</p>
                <p className="text-slate-400">
                  E-mail:{" "}
                  <a href="mailto:biuro@multicert.pl" className="text-[oklch(75%_.15_27)] hover:text-white transition-colors">
                    biuro@multicert.pl
                  </a>
                </p>
              </div>
              <p className="text-slate-400 text-sm mt-4">
                Dołożymy wszelkich starań, aby odpowiedzieć na zgłoszenie w ciągu 7 dni roboczych
                i wdrożyć niezbędne poprawki.
              </p>
            </section>

            {/* Legal basis */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Podstawa prawna
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                Deklaracja dostępności została sporządzona na podstawie samooceny
                przeprowadzonej przez podmiot publiczny. Niniejsza deklaracja dotyczy
                serwisu NowyCPR.pl prowadzonego przez Multicert Sp. z o.o. jako podmiot
                prywatny. Dostępność cyfrowa jest naszym zobowiązaniem wobec wszystkich
                użytkowników, niezależnie od stosowanych przez nich technologii wspomagających.
              </p>
            </section>

          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
