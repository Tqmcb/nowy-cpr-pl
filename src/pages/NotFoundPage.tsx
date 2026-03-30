import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen section-paper text-slate-900">
      <Helmet>
        <title>Strona nie znaleziona — NowyCPR.pl</title>
      </Helmet>
      <Header />
      <main id="main-content" className="pb-24">
        <section className="relative overflow-hidden border-b border-slate-800">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(100%) contrast(1.1) brightness(0.7)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(13,33,55,0.92) 0%, rgba(26,86,160,0.70) 100%)" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[4px]"
            style={{ background: "linear-gradient(to right, #8b1a3c 30%, #1a56a0 100%)" }}
          />
          <Container>
            <div className="relative z-10 pt-28 pb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/30 mb-6">
                <span className="text-white/70 text-sm font-mono">404</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-mono tracking-tight">
                404
              </h1>
              <p className="text-xl text-white/80 mb-2">Strona nie została znaleziona</p>
              <p className="text-white/60 max-w-md mx-auto">
                Podana strona nie istnieje lub została przeniesiona pod inny adres.
              </p>
            </div>
          </Container>
        </section>

        <Container>
          <div className="max-w-lg mx-auto pt-16 text-center space-y-6">
            <p className="text-slate-600">Co możesz teraz zrobić:</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/"
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#1a56a0] hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1a56a0]/10 flex items-center justify-center group-hover:bg-[#1a56a0]/20 transition-colors">
                  <Home className="w-5 h-5 text-[#1a56a0]" />
                </div>
                <span className="text-sm font-semibold text-[#0d2137]">Strona główna</span>
              </Link>

              <Link
                to="/wyroby"
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#1a56a0] hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1a56a0]/10 flex items-center justify-center group-hover:bg-[#1a56a0]/20 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-[#1a56a0]" />
                </div>
                <span className="text-sm font-semibold text-[#0d2137]">Katalog wyrobów</span>
              </Link>

              <Link
                to="/wyszukiwarka"
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#1a56a0] hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1a56a0]/10 flex items-center justify-center group-hover:bg-[#1a56a0]/20 transition-colors">
                  <Search className="w-5 h-5 text-[#1a56a0]" />
                </div>
                <span className="text-sm font-semibold text-[#0d2137]">Wyszukiwarka CPR</span>
              </Link>
            </div>

            <p className="text-slate-500 text-sm pt-4">
              Jeśli uważasz, że to błąd — napisz do nas:{" "}
              <a href="mailto:biuro@multicert.pl" className="text-[#1a56a0] hover:underline">
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
