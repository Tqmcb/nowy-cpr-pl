import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import { Mail, MapPin, Phone, Clock, ArrowRight } from "lucide-react";

export default function Kontakt() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <Helmet>
        <title>Kontakt — NowyCPR.pl</title>
        <meta name="description" content="Skontaktuj się z zespołem NowyCPR.pl. Multicert Sp. z o.o., ul. Mydlarska 47, 04-690 Warszawa." />
      </Helmet>
      <Header />
      <main id="main-content" className="pt-24 pb-20">
        <Container>
          {/* Page header */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 mb-6">
              <Mail className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Skontaktuj się z nami</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Kontakt
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Masz pytania dotyczące CPR 2024/3110 lub naszych usług certyfikacyjnych?
              Chętnie pomożemy.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">

            {/* Contact cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">E-mail</p>
                  <a
                    href="mailto:biuro@multicert.pl"
                    className="text-white font-semibold hover:text-amber-400 transition-colors"
                  >
                    biuro@multicert.pl
                  </a>
                  <p className="text-slate-400 text-sm mt-2">
                    Odpowiadamy w ciągu 1–2 dni roboczych.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-400/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Adres</p>
                  <p className="text-white font-semibold">Multicert Sp. z o.o.</p>
                  <p className="text-slate-300">ul. Mydlarska 47</p>
                  <p className="text-slate-300">04-690 Warszawa</p>
                </div>
              </div>

            </div>

            {/* About Multicert */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Multicert Sp. z o.o.
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Jesteśmy polską jednostką certyfikującą specjalizującą się w certyfikacji
                wyrobów budowlanych i potwierdzaniu zgodności z wymaganiami CPR. Portal
                NowyCPR.pl jest naszą inicjatywą edukacyjną, skierowaną do producentów,
                importerów i dystrybutorów wyrobów budowlanych w Polsce.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Oferujemy kompleksowe wsparcie na każdym etapie procesu certyfikacji —
                od przygotowania dokumentacji technicznej, przez wstępne badanie typu (ITT),
                po audyt zakładowej kontroli produkcji (FPC) i wystawienie certyfikatu.
              </p>
            </section>

            {/* Services CTA */}
            <section className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Potrzebujesz wsparcia w certyfikacji?
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Skontaktuj się z nami, aby dowiedzieć się więcej o naszych usługach certyfikacyjnych
                i uzyskać indywidualną ofertę dla Twojego wyrobu budowlanego.
              </p>
              <a
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-colors"
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
