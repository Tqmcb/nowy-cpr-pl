import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Shield, Mail, FileText, Eye, Trash2, Lock, RefreshCw, ArrowRight } from "lucide-react";

export default function PolitykaPrywatnosci() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <Helmet>
        <title>Polityka Prywatności — NowyCPR.pl</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <main className="pt-24 pb-20">
        <Container>
          {/* Page header */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[oklch(55%_.22_27/0.1)] border border-[oklch(55%_.22_27/0.2)] mb-6">
              <Shield className="w-4 h-4 text-[oklch(75%_.15_27)]" />
              <span className="text-[oklch(75%_.15_27)] text-sm font-medium">Ochrona danych osobowych</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Polityka Prywatności
            </h1>
            <p className="text-slate-400">
              Data ostatniej aktualizacji: <span className="text-slate-300 font-medium">8 stycznia 2026 r.</span>
            </p>
          </div>

          {/* Main content */}
          <div className="max-w-3xl mx-auto space-y-10">

            {/* Section 1 */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center text-[oklch(75%_.15_27)] font-bold text-sm flex-shrink-0">1</span>
                Administrator danych osobowych
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Administratorem Państwa danych osobowych jest:
              </p>
              <div className="rounded-xl bg-slate-800/60 border border-white/10 p-5 space-y-1">
                <p className="text-white font-semibold">Multicert Sp. z o.o.</p>
                <p className="text-slate-400">ul. Mydlarska 47A, 04-690 Warszawa</p>
                <p className="text-slate-400">
                  E-mail:{" "}
                  <a href="mailto:biuro@multicert.pl" className="text-[oklch(75%_.15_27)] hover:text-white transition-colors">
                    biuro@multicert.pl
                  </a>
                </p>
              </div>
              <p className="text-slate-400 mt-4 leading-relaxed">
                Multicert Sp. z o.o. jest wydawcą portalu informacyjnego NowyCPR.pl, dostępnego pod adresem{" "}
                <a href="https://www.nowycpr.pl" className="text-[oklch(75%_.15_27)] hover:text-white transition-colors">
                  www.nowycpr.pl
                </a>.
              </p>
            </section>

            {/* Section 2 */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center text-[oklch(75%_.15_27)] font-bold text-sm flex-shrink-0">2</span>
                Cele i podstawy prawne przetwarzania danych
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Państwa dane osobowe przetwarzane są w następujących celach i na następujących podstawach prawnych, wynikających z art. 6 Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO):
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: "Obsługa newslettera",
                    desc: "Jeśli zdecydują się Państwo na subskrypcję newslettera, dane (adres e-mail) przetwarzane są w celu przesyłania informacji o aktualnościach dotyczących Rozporządzenia CPR (UE) 2024/3110 oraz działalności portalu NowyCPR.pl.",
                    basis: "Podstawa prawna: art. 6 ust. 1 lit. a RODO — zgoda osoby, której dane dotyczą.",
                    color: "emerald"
                  },
                  {
                    title: "Obsługa zapytań i formularza kontaktowego",
                    desc: "Dane podane w formularzu kontaktowym (imię, adres e-mail, treść wiadomości) przetwarzane są wyłącznie w celu udzielenia odpowiedzi na skierowane zapytanie.",
                    basis: "Podstawa prawna: art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes Administratora polegający na obsłudze korespondencji.",
                    color: "blue"
                  },
                  {
                    title: "Analiza ruchu na stronie",
                    desc: "W celu ulepszania zawartości portalu i poprawy jego funkcjonalności mogą być stosowane narzędzia analityczne, takie jak Google Analytics. Narzędzia te zbierają zanonimizowane dane statystyczne dotyczące ruchu (np. liczba odwiedzin, czas spędzony na stronie, źródło ruchu).",
                    basis: "Podstawa prawna: art. 6 ust. 1 lit. a RODO — zgoda wyrażona poprzez akceptację plików cookies analitycznych; art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes Administratora w zakresie ulepszania serwisu.",
                    color: "purple"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-800/60 border border-white/10 p-5">
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3">{item.desc}</p>
                    <p className="text-slate-500 text-xs italic">{item.basis}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center text-[oklch(75%_.15_27)] font-bold text-sm flex-shrink-0">3</span>
                Okres przechowywania danych
              </h2>
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p>Dane osobowe przechowywane są przez okres niezbędny do realizacji celów, dla których zostały zebrane:</p>
                <ul className="space-y-2 mt-4">
                  {[
                    "Dane subskrybentów newslettera — do momentu cofnięcia zgody (rezygnacji z subskrypcji).",
                    "Dane z formularza kontaktowego — przez czas niezbędny do obsługi zapytania, nie dłużej niż 12 miesięcy od udzielenia odpowiedzi, chyba że przepisy prawa wymagają dłuższego przechowywania.",
                    "Dane analityczne (cookies) — zgodnie z polityką dostawcy narzędzia analitycznego (Google Analytics), co do zasady nie dłużej niż 14 miesięcy (w wersji GA4 standardowej; maksymalnie 26 miesięcy dotyczy wyłącznie GA4 360).",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-[oklch(75%_.15_27)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 4 — Rights */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center text-[oklch(75%_.15_27)] font-bold text-sm flex-shrink-0">4</span>
                Prawa osoby, której dane dotyczą
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Na podstawie przepisów RODO przysługują Państwu następujące prawa w odniesieniu do własnych danych osobowych:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Eye, title: "Prawo dostępu", desc: "Prawo do uzyskania informacji o przetwarzanych danych oraz ich kopii (art. 15 RODO).", color: "text-[oklch(75%_.15_27)]", bg: "bg-[oklch(55%_.22_27/0.12)]" },
                  { icon: RefreshCw, title: "Prawo do sprostowania", desc: "Prawo do żądania poprawienia nieprawidłowych lub uzupełnienia niekompletnych danych (art. 16 RODO).", color: "text-[oklch(75%_.15_27)]", bg: "bg-[oklch(55%_.22_27/0.12)]" },
                  { icon: Trash2, title: "Prawo do usunięcia", desc: "Prawo do żądania usunięcia danych (\"prawo do bycia zapomnianym\") w przypadkach określonych w art. 17 RODO.", color: "text-[oklch(75%_.15_27)]", bg: "bg-[oklch(55%_.22_27/0.12)]" },
                  { icon: Lock, title: "Prawo do ograniczenia", desc: "Prawo do żądania ograniczenia przetwarzania danych w przypadkach określonych w art. 18 RODO.", color: "text-[oklch(75%_.15_27)]", bg: "bg-[oklch(55%_.22_27/0.12)]" },
                  { icon: FileText, title: "Prawo do przenoszenia", desc: "Prawo do otrzymania danych w ustrukturyzowanym formacie i przeniesienia ich do innego administratora (art. 20 RODO).", color: "text-[oklch(75%_.15_27)]", bg: "bg-[oklch(55%_.22_27/0.12)]" },
                  { icon: Shield, title: "Prawo do sprzeciwu", desc: "Prawo do sprzeciwu wobec przetwarzania danych opartego na prawnie uzasadnionym interesie Administratora (art. 21 RODO).", color: "text-[oklch(75%_.15_27)]", bg: "bg-[oklch(55%_.22_27/0.12)]" },
                ].map((right, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-800/60 border border-white/10 p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg ${right.bg} flex items-center justify-center flex-shrink-0`}>
                        <right.icon className={`w-4 h-4 ${right.color}`} />
                      </div>
                      <h3 className="text-white font-semibold text-sm">{right.title}</h3>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{right.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-[oklch(55%_.22_27/0.1)] border border-[oklch(55%_.22_27/0.2)] p-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-[oklch(75%_.15_27)] font-semibold">Jak skorzystać z praw?</span>{" "}
                  Wniosek w sprawie realizacji praw należy kierować na adres e-mail:{" "}
                  <a href="mailto:biuro@multicert.pl" className="text-[oklch(75%_.15_27)] hover:text-white transition-colors font-medium">
                    biuro@multicert.pl
                  </a>. Administrator rozpatrzy wniosek bez zbędnej zwłoki, nie później niż w ciągu 30 dni od jego otrzymania.
                </p>
              </div>
              <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                W przypadku uznania, że przetwarzanie danych osobowych narusza przepisy RODO, przysługuje Państwu prawo wniesienia skargi do organu nadzorczego — Prezesa Urzędu Ochrony Danych Osobowych (ul. Moniuszki 1A, 00-014 Warszawa, <a href="https://www.uodo.gov.pl" className="text-[oklch(75%_.15_27)] hover:text-white transition-colors">www.uodo.gov.pl</a>).
              </p>
            </section>

            {/* Section 5 — Cookies */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center text-[oklch(75%_.15_27)] font-bold text-sm flex-shrink-0">5</span>
                Pliki cookies
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Portal NowyCPR.pl korzysta z plików cookies (ciasteczek) — małych plików tekstowych zapisywanych na urządzeniu użytkownika. Stosujemy dwa rodzaje plików cookies:
              </p>
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-800/60 border border-[oklch(55%_.22_27/0.2)] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-[oklch(55%_.22_27/0.12)] text-[oklch(75%_.15_27)] text-xs font-semibold">Niezbędne</span>
                    <span className="text-slate-500 text-xs">— nie wymagają zgody</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Cookies niezbędne do prawidłowego funkcjonowania serwisu (np. zapamiętanie preferencji wyświetlania). Są automatycznie instalowane podczas wizyty na portalu i nie mogą zostać wyłączone bez zakłócenia działania serwisu.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-800/60 border border-[oklch(55%_.22_27/0.2)] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-[oklch(55%_.22_27/0.12)] text-[oklch(75%_.15_27)] text-xs font-semibold">Analityczne</span>
                    <span className="text-slate-500 text-xs">— wymagają zgody</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Cookies analityczne (np. Google Analytics) umożliwiają zbieranie anonimowych statystyk dotyczących korzystania ze strony. Są instalowane wyłącznie po wyrażeniu zgody przez użytkownika. Zgodę można wycofać w dowolnym momencie, zmieniając ustawienia przeglądarki lub korzystając z narzędzia zarządzania zgodami na stronie.
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-5 leading-relaxed">
                Większość przeglądarek internetowych domyślnie akceptuje pliki cookies. Użytkownik może w każdym czasie zmienić ustawienia przeglądarki, by zablokować cookies lub otrzymywać ostrzeżenia przed ich zapisaniem. Wyłączenie cookies niezbędnych może jednak uniemożliwić prawidłowe korzystanie z serwisu.
              </p>
            </section>

            {/* Section 6 — External links */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center text-[oklch(75%_.15_27)] font-bold text-sm flex-shrink-0">6</span>
                Odesłania do zewnętrznych serwisów
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Portal NowyCPR.pl zawiera odsyłacze (linki) do zewnętrznych serwisów internetowych, w tym m.in. do EUR-Lex (prawo Unii Europejskiej), gov.pl (serwisy administracji publicznej), NANDO (notyfikowane jednostki oceny zgodności), ECHA (Europejska Agencja Chemikaliów) oraz PKN (Polskie Centrum Normalizacji). Administratorem danych osobowych gromadzonych przez te serwisy są ich właściwi administratorzy. Multicert Sp. z o.o. nie ponosi odpowiedzialności za politykę prywatności stosowaną przez operatorów zewnętrznych witryn.
              </p>
            </section>

            {/* Section 7 — Recipients */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center text-[oklch(75%_.15_27)] font-bold text-sm flex-shrink-0">7</span>
                Odbiorcy danych
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Dane osobowe użytkowników mogą być przekazywane:
              </p>
              <ul className="space-y-2">
                {[
                  "Podmiotom świadczącym usługi hostingowe, utrzymujące infrastrukturę techniczną portalu.",
                  "Dostawcom narzędzi analitycznych (np. Google LLC — w ramach usługi Google Analytics, z zastrzeżeniem standardowych klauzul umownych zabezpieczających transfer danych do USA).",
                  "Dostawcom oprogramowania do obsługi newslettera.",
                  "Podmiotom uprawnionym do uzyskania danych na podstawie obowiązujących przepisów prawa.",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-400 text-sm">
                    <ArrowRight className="w-4 h-4 text-[oklch(75%_.15_27)] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-400 text-sm mt-4">
                Dane nie są sprzedawane ani udostępniane innym podmiotom w celach marketingowych bez uprzedniej zgody.
              </p>
            </section>

            {/* Contact for data protection */}
            <div className="rounded-2xl border border-[oklch(55%_.22_27/0.2)] bg-[oklch(55%_.22_27/0.05)] p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[oklch(55%_.22_27/0.12)] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[oklch(75%_.15_27)]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-2">Kontakt w sprawach ochrony danych</h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    We wszelkich sprawach dotyczących ochrony danych osobowych prosimy o kontakt pod adresem e-mail:{" "}
                    <a href="mailto:biuro@multicert.pl" className="text-[oklch(75%_.15_27)] hover:text-white transition-colors font-medium">
                      biuro@multicert.pl
                    </a>{" "}
                    lub pisemnie na adres siedziby Administratora: ul. Mydlarska 47A, 04-690 Warszawa.
                  </p>
                </div>
              </div>
            </div>

            {/* Update date */}
            <p className="text-slate-500 text-sm text-center">
              Niniejsza polityka prywatności obowiązuje od dnia 8 stycznia 2026 r.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
