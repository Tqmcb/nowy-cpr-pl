import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { FileText, ArrowRight } from "lucide-react";

const sections = [
  {
    num: "I",
    title: "Postanowienia ogólne",
    color: "amber",
    content: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          1. Portal internetowy NowyCPR.pl (dalej: „Portal" lub „Serwis"), dostępny pod adresem{" "}
          <a href="https://www.nowycpr.pl" className="text-amber-400 hover:text-amber-300 transition-colors">
            www.nowycpr.pl
          </a>
          , jest prowadzony przez <span className="text-white font-medium">Multicert Sp. z o.o.</span> z siedzibą
          przy ul. Mydlarskiej 47, 04-690 Warszawa (dalej: „Wydawca").
        </p>
        <p>
          2. Niniejszy Regulamin określa zasady korzystania z Serwisu, prawa i obowiązki użytkowników
          oraz zakres odpowiedzialności Wydawcy.
        </p>
        <p>
          3. Korzystanie z Serwisu jest równoznaczne z akceptacją niniejszego Regulaminu
          w jego aktualnym brzmieniu.
        </p>
        <p>
          4. Wydawca zastrzega sobie prawo do zmiany niniejszego Regulaminu. Zmiany wchodzą w życie
          z chwilą ich opublikowania w Serwisie.
        </p>
      </div>
    )
  },
  {
    num: "II",
    title: "Charakter serwisu",
    color: "blue",
    content: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          1. NowyCPR.pl jest serwisem o charakterze <span className="text-white font-medium">wyłącznie informacyjnym</span>.
          Treści publikowane na Portalu mają na celu prezentację wiedzy na temat Rozporządzenia Parlamentu
          Europejskiego i Rady (UE) 2024/3110 (CPR 2024) oraz zagadnień z nim związanych.
        </p>
        <p>
          2. Treści zamieszczone w Serwisie <span className="text-white font-medium">nie stanowią</span> porady
          prawnej, certyfikacyjnej, technicznej ani inżynierskiej w rozumieniu przepisów prawa.
          W sprawach wymagających indywidualnej analizy prawnej lub technicznej zaleca się skonsultowanie
          z wykwalifikowanym doradcą lub specjalistą.
        </p>
        <p>
          3. Wydawca dokłada wszelkich starań, aby treści publikowane w Serwisie były rzetelne i aktualne,
          jednak nie może zagwarantować ich pełnej kompletności i aktualności w każdym momencie,
          biorąc pod uwagę dynamicznie zmieniające się otoczenie regulacyjne UE.
        </p>
      </div>
    )
  },
  {
    num: "III",
    title: "Korzystanie z serwisu",
    color: "emerald",
    content: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          1. Dostęp do zasobów Portalu jest <span className="text-white font-medium">bezpłatny</span> i nie wymaga
          rejestracji.
        </p>
        <p>
          2. Portal NowyCPR.pl jest skierowany przede wszystkim do przedsiębiorców oraz specjalistów
          branży budowlanej, w tym producentów, importerów, dystrybutorów i sprzedawców wyrobów
          budowlanych, a także organów nadzoru budowlanego i jednostek oceny zgodności.
        </p>
        <p>
          3. Użytkownik zobowiązuje się do korzystania z Serwisu w sposób zgodny z obowiązującymi
          przepisami prawa, zasadami współżycia społecznego oraz postanowieniami niniejszego Regulaminu.
        </p>
        <p>
          4. Zabrania się korzystania z Serwisu w sposób mogący zakłócić jego funkcjonowanie,
          w szczególności poprzez stosowanie oprogramowania automatycznie pobierającego dane
          (web scraping) bez uprzedniej zgody Wydawcy.
        </p>
        <p>
          5. Wydawca zastrzega sobie prawo do czasowego zawieszenia dostępu do Serwisu
          w związku z pracami konserwacyjnymi lub modernizacyjnymi.
        </p>
      </div>
    )
  },
  {
    num: "IV",
    title: "Prawa autorskie",
    color: "purple",
    content: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          1. Wszystkie treści publikowane na Portalu NowyCPR.pl, w tym teksty, grafiki, układy stron
          i bazy danych, są chronione prawem autorskim i stanowią własność Multicert Sp. z o.o.
          lub zostały opublikowane za zgodą uprawnionych podmiotów.
        </p>
        <p>
          2. Cytowanie fragmentów treści opublikowanych w Serwisie jest dozwolone pod warunkiem:
        </p>
        <ul className="space-y-1 ml-4">
          {[
            "wyraźnego podania źródła (NowyCPR.pl — portal Multicert Sp. z o.o.),",
            "zamieszczenia aktywnego odnośnika do cytowanej strony Portalu,",
            "cytowanie nie może naruszać normalnego korzystania z Serwisu ani godzić w interesy Wydawcy."
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          3. Reprodukowanie, dystrybuowanie lub komercyjne wykorzystywanie treści Serwisu w całości
          lub w istotnej części bez uprzedniej pisemnej zgody Wydawcy jest zabronione.
        </p>
        <p>
          4. Dokumenty unijne (akty prawne UE, komunikaty Komisji Europejskiej) oraz normy
          krajowe, do których Serwis prowadzi odesłania, podlegają odrębnym reżimom prawnym
          określonym przez ich właściwych wydawców.
        </p>
      </div>
    )
  },
  {
    num: "V",
    title: "Wyłączenie odpowiedzialności",
    color: "red",
    content: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          1. Treści opublikowane na Portalu NowyCPR.pl mają charakter wyłącznie informacyjny.
          Multicert Sp. z o.o. <span className="text-white font-medium">nie ponosi odpowiedzialności</span> za decyzje
          biznesowe, prawne ani techniczne podjęte przez użytkowników na podstawie informacji
          uzyskanych z Serwisu.
        </p>
        <p>
          2. Wydawca nie ponosi odpowiedzialności za ewentualne błędy, nieścisłości lub pominięcia
          w treściach Serwisu, ani za ich nieaktualność wynikającą ze zmian w przepisach prawa po
          dacie publikacji.
        </p>
        <p>
          3. Wydawca nie ponosi odpowiedzialności za treści dostępne w zewnętrznych serwisach
          internetowych, do których prowadzą odesłania zamieszczone w Portalu.
        </p>
        <p>
          4. Wydawca nie ponosi odpowiedzialności za przerwy w dostępności Serwisu wynikające
          z przyczyn technicznych lub awarii niezależnych od Wydawcy.
        </p>
      </div>
    )
  },
  {
    num: "VI",
    title: "Odesłania do zewnętrznych serwisów",
    color: "cyan",
    content: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          1. Serwis zawiera odesłania (linki) do zewnętrznych stron internetowych, w tym m.in.
          EUR-Lex, gov.pl, NANDO, ECHA i PKN. Odesłania te służą wyłącznie celom informacyjnym.
        </p>
        <p>
          2. Wydawca nie sprawuje kontroli nad treścią ani polityką prywatności zewnętrznych serwisów
          i nie odpowiada za ich zawartość, dostępność ani aktualizację.
        </p>
        <p>
          3. Korzystanie z zewnętrznych serwisów odbywa się na warunkach określonych przez ich operatorów.
        </p>
      </div>
    )
  },
  {
    num: "VII",
    title: "Newsletter",
    color: "orange",
    content: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          1. Portal NowyCPR.pl może oferować usługę newslettera — bezpłatnej subskrypcji wiadomości
          e-mail z aktualnościami dotyczącymi CPR 2024 i tematów pokrewnych.
        </p>
        <p>
          2. Subskrypcja newslettera jest dobrowolna i wymaga podania adresu e-mail oraz
          potwierdzenia zgody na przetwarzanie danych osobowych w tym celu.
        </p>
        <p>
          3. Użytkownik może zrezygnować z subskrypcji newslettera w dowolnym momencie,
          klikając link „Wypisz się" zawarty w każdej wiadomości lub kontaktując się
          z Wydawcą pod adresem{" "}
          <a href="mailto:biuro@multicert.pl" className="text-amber-400 hover:text-amber-300 transition-colors">
            biuro@multicert.pl
          </a>.
        </p>
        <p>
          4. Szczegółowe zasady przetwarzania danych subskrybentów newslettera określa
          Polityka Prywatności dostępna pod adresem{" "}
          <a href="/polityka-prywatnosci" className="text-amber-400 hover:text-amber-300 transition-colors">
            /polityka-prywatnosci
          </a>.
        </p>
      </div>
    )
  },
  {
    num: "VIII",
    title: "Zmiany Regulaminu",
    color: "slate",
    content: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          1. Wydawca zastrzega sobie prawo do zmiany niniejszego Regulaminu w każdym czasie.
        </p>
        <p>
          2. O istotnych zmianach Regulaminu Wydawca poinformuje użytkowników poprzez
          opublikowanie zaktualizowanej wersji Regulaminu w Serwisie ze wskazaniem daty
          jego ostatniej aktualizacji.
        </p>
        <p>
          3. Dalsze korzystanie z Serwisu po opublikowaniu zmian oznacza akceptację
          znowelizowanego Regulaminu.
        </p>
      </div>
    )
  },
  {
    num: "IX",
    title: "Postanowienia końcowe",
    color: "indigo",
    content: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          1. W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają
          odpowiednie przepisy prawa polskiego, w szczególności Kodeksu cywilnego,
          ustawy o świadczeniu usług drogą elektroniczną oraz Rozporządzenia RODO.
        </p>
        <p>
          2. Wszelkie spory wynikające z korzystania z Serwisu będą rozstrzygane przez
          sąd właściwy miejscowo dla siedziby Wydawcy, to jest sąd właściwy dla
          m.st. Warszawy.
        </p>
        <p>
          3. Jeżeli którekolwiek postanowienie niniejszego Regulaminu okaże się nieważne
          lub nieskuteczne, pozostałe postanowienia zachowują pełną moc i skuteczność.
        </p>
        <p>
          4. Niniejszy Regulamin wchodzi w życie z dniem 8 stycznia 2026 r.
        </p>
      </div>
    )
  }
];

export default function Regulamin() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <Helmet>
        <title>Regulamin — NowyCPR.pl</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <main className="pt-24 pb-20">
        <Container>
          {/* Page header */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 mb-6">
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Zasady korzystania z serwisu</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Regulamin serwisu NowyCPR.pl</h1>
            <p className="text-slate-400">
              Data wejścia w życie: <span className="text-slate-300 font-medium">8 stycznia 2026 r.</span>
            </p>
          </div>

          {/* Intro notice */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
              <p className="text-slate-300 text-sm leading-relaxed">
                Niniejszy Regulamin określa zasady korzystania z portalu informacyjnego NowyCPR.pl,
                prowadzonego przez Multicert Sp. z o.o. Przed skorzystaniem z Serwisu prosimy
                o zapoznanie się z jego treścią.
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="max-w-3xl mx-auto space-y-6">
            {sections.map((section) => (
              <section key={section.num} className="rounded-2xl border border-white/10 bg-white/5 p-8">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-slate-300 font-bold text-sm flex-shrink-0">
                    {section.num}
                  </span>
                  {section.title}
                </h2>
                {section.content}
              </section>
            ))}

            {/* Footer note */}
            <p className="text-slate-500 text-sm text-center pt-4">
              Wydawca: Multicert Sp. z o.o., ul. Mydlarska 47, 04-690 Warszawa &bull;{" "}
              <a href="mailto:biuro@multicert.pl" className="text-amber-400 hover:text-amber-300 transition-colors">
                biuro@multicert.pl
              </a>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
