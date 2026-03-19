import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Mail, MapPin, Phone, Clock, ArrowRight } from "lucide-react";

export default function Kontakt() {
  return (
    <div className="min-h-screen section-paper text-slate-900">
      <Helmet>
        <title>Kontakt — NowyCPR.pl</title>
        <meta name="description" content="Skontaktuj się z zespołem NowyCPR.pl. Multicert Sp. z o.o., ul. Mydlarska 47, 04-690 Warszawa." />
      </Helmet>
      <Header />
      <main id="main-content" className="pb-20">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80')", backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(100%) contrast(1.1) brightness(0.75)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(13,33,55,0.88) 0%, rgba(26,86,160,0.65) 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[4px]" style={{ background: "linear-gradient(to right, #8b1a3c 30%, #1a56a0 100%)" }} />
          <Container>
            <div className="relative z-10 pt-28 pb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/30 mb-6">
                <Mail className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Skontaktuj się z nami</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Kontakt</h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Masz pytania dotyczące CPR 2024/3110 lub naszych usług certyfikacyjnych? Chętnie pomożemy.
              </p>
            </div>
          </Container>
        </section>
        <Container>
          <div className="max-w-3xl mx-auto space-y-8 pt-12">

            {/* Contact cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1a56a0]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#1a56a0]" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">E-mail</p>
                  <a
                    href="mailto:biuro@multicert.pl"
                    className="text-[#0d2137] font-semibold hover:text-[#1a56a0] transition-colors"
                  >
                    biuro@multicert.pl
                  </a>
                  <p className="text-slate-500 text-sm mt-2">
                    Odpowiadamy w ciągu 1–2 dni roboczych.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1a56a0]/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#1a56a0]" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Adres</p>
                  <p className="text-[#0d2137] font-semibold">Multicert Sp. z o.o.</p>
                  <p className="text-slate-700">ul. Mydlarska 47</p>
                  <p className="text-slate-700">04-690 Warszawa</p>
                </div>
              </div>

            </div>

            {/* About Multicert */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
              <h2 className="text-xl font-bold text-[#0d2137] mb-4">
                Multicert Sp. z o.o.
              </h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                Jesteśmy polską jednostką certyfikującą specjalizującą się w certyfikacji
                wyrobów budowlanych i potwierdzaniu zgodności z wymaganiami CPR. Portal
                NowyCPR.pl jest naszą inicjatywą edukacyjną, skierowaną do producentów,
                importerów i dystrybutorów wyrobów budowlanych w Polsce.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Oferujemy kompleksowe wsparcie na każdym etapie procesu certyfikacji —
                od przygotowania dokumentacji technicznej, przez wstępne badanie typu (ITT),
                po audyt zakładowej kontroli produkcji (FPC) i wystawienie certyfikatu.
              </p>
            </section>

            {/* Services CTA */}
            <section className="rounded-2xl border border-[#1a56a0]/20 bg-[#1a56a0]/5 p-8">
              <h2 className="text-xl font-bold text-[#0d2137] mb-4">
                Potrzebujesz wsparcia w certyfikacji?
              </h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                Skontaktuj się z nami, aby dowiedzieć się więcej o naszych usługach certyfikacyjnych
                i uzyskać indywidualną ofertę dla Twojego wyrobu budowlanego.
              </p>
              <a
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d2137] hover:bg-[#1a3d6b] text-white font-semibold rounded-xl transition-colors"
              >
                Nasze usługi certyfikacyjne
                <ArrowRight className="w-4 h-4" />
              </a>
            </section>

          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
