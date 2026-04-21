import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Helmet>
        <title>Strona nie znaleziona — NowyCPR.pl</title>
      </Helmet>
      <Header />
      <main id="main-content" className="pb-24">
        <section className="relative pt-32 pb-20 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-baseline gap-6 mb-10">
                <span className="editorial-numeral text-6xl md:text-7xl" style={{ color: "oklch(55% .22 27)", fontWeight: 300 }}>—</span>
                <div className="flex items-center gap-3 pt-4">
                  <div className="h-[2px] w-10" style={{ backgroundColor: "oklch(55% .22 27)" }} />
                  <span className="editorial-kicker">Błąd 404</span>
                </div>
              </div>
              <div className="editorial-numeral text-[10rem] md:text-[14rem] leading-[0.8] mb-6" style={{ color: "oklch(20% .03 264)", fontWeight: 300 }}>
                404
              </div>
              <h1 className="font-serif text-3xl md:text-4xl leading-[1.1] mb-3" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                Strona nie została <span className="italic" style={{ color: "oklch(55% .22 27)" }}>znaleziona</span>.
              </h1>
              <p className="text-base md:text-lg max-w-xl" style={{ color: "oklch(42% .02 264)" }}>
                Podana strona nie istnieje lub została przeniesiona pod inny adres.
              </p>
            </div>
          </Container>
        </section>

        <Container>
          <div className="max-w-6xl mx-auto pt-12">
            <div className="editorial-kicker mb-6" style={{ color: "oklch(60% .015 264)" }}>Co możesz teraz zrobić</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0" style={{ borderTop: "2px solid oklch(20% .03 264)" }}>
              {[
                { to: "/", icon: Home, label: "Strona główna" },
                { to: "/wyroby", icon: ArrowLeft, label: "Katalog wyrobów" },
                { to: "/wyszukiwarka", icon: Search, label: "Wyszukiwarka CPR" },
              ].map((item, idx) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group p-8 transition-all hover:bg-slate-50"
                  style={{
                    borderRight: idx < 2 ? "1px solid oklch(92% .008 264)" : "none",
                    borderBottom: "1px solid oklch(92% .008 264)"
                  }}
                >
                  <item.icon className="w-6 h-6 mb-4" style={{ color: "oklch(20% .03 264)" }} />
                  <h3 className="font-serif text-xl md:text-2xl leading-[1.2] group-hover:italic transition-all" style={{ color: "oklch(20% .03 264)", fontWeight: 500 }}>
                    {item.label}
                  </h3>
                </Link>
              ))}
            </div>
            <p className="text-sm mt-10" style={{ color: "oklch(60% .015 264)" }}>
              Jeśli uważasz, że to błąd — napisz do nas:{" "}
              <a href="mailto:biuro@multicert.pl" className="underline" style={{ color: "oklch(55% .22 27)" }}>
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
