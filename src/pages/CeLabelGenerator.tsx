import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import {
  ChevronRight,
  Download,
  RotateCcw,
  Eye,
  Printer,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────────────────

interface LabelData {
  producerName: string;
  producerAddress: string;
  productName: string;
  notifiedBodyNumber: string;
  dopcNumber: string;
  year: string;
  harmonizedStandard: string;
  declaredProperties: string;
}

const EMPTY: LabelData = {
  producerName: "",
  producerAddress: "",
  productName: "",
  notifiedBodyNumber: "",
  dopcNumber: "",
  year: new Date().getFullYear().toString().slice(-2),
  harmonizedStandard: "",
  declaredProperties: "",
};

// ────────────────────────────────────────────────────────────────────────────
// CE LABEL SVG COMPONENT
// ────────────────────────────────────────────────────────────────────────────

function CeLabelPreview({ data }: { data: LabelData }) {
  const lines = data.declaredProperties
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const baseHeight = 340;
  const extraLines = Math.max(0, lines.length - 2);
  const height = baseHeight + extraLines * 18;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 400 ${height}`}
      className="w-full max-w-md"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* Background */}
      <rect width="400" height={height} rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />

      {/* CE Symbol */}
      <g transform="translate(30, 25)">
        {/* Official CE mark proportions */}
        <text fontSize="56" fontWeight="bold" fill="#1e293b" letterSpacing="-2">
          CE
        </text>
      </g>

      {/* Notified body number */}
      {data.notifiedBodyNumber && (
        <text x="120" y="62" fontSize="24" fontWeight="bold" fill="#1e293b">
          {data.notifiedBodyNumber}
        </text>
      )}

      {/* Year line */}
      <line x1="20" y1="80" x2="380" y2="80" stroke="#cbd5e1" strokeWidth="1" />

      {/* Year of first marking */}
      <text x="20" y="100" fontSize="10" fill="#94a3b8">
        Rok pierwszego oznakowania
      </text>
      <text x="20" y="116" fontSize="13" fontWeight="600" fill="#1e293b">
        {data.year ? `20${data.year}` : "----"}
      </text>

      {/* Producer */}
      <text x="200" y="100" fontSize="10" fill="#94a3b8">
        Producent
      </text>
      <text x="200" y="116" fontSize="12" fontWeight="600" fill="#1e293b">
        {data.producerName || "---"}
      </text>
      {data.producerAddress && (
        <text x="200" y="131" fontSize="10" fill="#64748b">
          {data.producerAddress.length > 40 ? data.producerAddress.slice(0, 40) + "..." : data.producerAddress}
        </text>
      )}

      <line x1="20" y1="140" x2="380" y2="140" stroke="#cbd5e1" strokeWidth="1" />

      {/* Product name */}
      <text x="20" y="158" fontSize="10" fill="#94a3b8">
        Wyrob budowlany
      </text>
      <text x="20" y="175" fontSize="13" fontWeight="600" fill="#1e293b">
        {data.productName || "---"}
      </text>

      {/* DoP&C reference */}
      <text x="20" y="198" fontSize="10" fill="#94a3b8">
        Nr DoP&amp;C
      </text>
      <text x="20" y="214" fontSize="12" fontWeight="600" fill="#1e293b">
        {data.dopcNumber || "---"}
      </text>

      {/* Harmonized standard */}
      <text x="200" y="198" fontSize="10" fill="#94a3b8">
        Norma zharmonizowana
      </text>
      <text x="200" y="214" fontSize="12" fontWeight="600" fill="#1e293b">
        {data.harmonizedStandard || "---"}
      </text>

      <line x1="20" y1="228" x2="380" y2="228" stroke="#cbd5e1" strokeWidth="1" />

      {/* Declared properties */}
      <text x="20" y="248" fontSize="10" fill="#94a3b8">
        Deklarowane wlasciwosci uzytkowe
      </text>
      {lines.length > 0 ? (
        lines.map((line, i) => (
          <text key={i} x="20" y={266 + i * 18} fontSize="11" fill="#334155">
            {line.length > 55 ? line.slice(0, 55) + "..." : line}
          </text>
        ))
      ) : (
        <text x="20" y="266" fontSize="11" fill="#94a3b8" fontStyle="italic">
          (wpisz wlasciwosci)
        </text>
      )}

      {/* Footer */}
      <line x1="20" y1={height - 30} x2="380" y2={height - 30} stroke="#cbd5e1" strokeWidth="1" />
      <text x="20" y={height - 12} fontSize="9" fill="#94a3b8">
        Rozp. (UE) 2024/3110, Art. 20 | Wygenerowano na NowyCPR.pl
      </text>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export default function CeLabelGenerator() {
  const navigate = useNavigate();
  const [data, setData] = useState<LabelData>(EMPTY);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const update = (field: keyof LabelData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    if (!svgContainerRef.current) return;
    const svgEl = svgContainerRef.current.querySelector("svg");
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Etykieta CE - ${data.productName || "wyrob"}</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: flex-start; padding: 20mm; }
          svg { max-width: 100mm; height: auto; }
          @media print { body { padding: 10mm; } }
        </style>
      </head>
      <body>${svgData}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadSvg = () => {
    if (!svgContainerRef.current) return;
    const svgEl = svgContainerRef.current.querySelector("svg");
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `etykieta-ce-${data.productName.replace(/\s+/g, "-").toLowerCase() || "wyrob"}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pageTitle = "Generator etykiety CE - CPR 2024/3110 | NowyCPR.pl";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Wygeneruj etykiete oznakowania CE wyrobu budowlanego zgodna z Art. 20 CPR 2024/3110. Podglad na zywo, druk i pobranie SVG." />
        <link rel="canonical" href="https://www.nowycpr.pl/generator-ce" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main id="main-content" className="flex-grow pt-24 pb-20">
          {/* Hero */}
          <section className="relative overflow-hidden pb-6">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-transparent" />
            <Container>
              <div className="relative pt-8">
                <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                  <button onClick={() => navigate("/")} className="hover:text-amber-400 transition-colors">Strona glowna</button>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-white">Generator etykiety CE</span>
                </nav>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Generator etykiety CE</h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                  Wypelnij formularz i wygeneruj etykiete oznakowania CE zgodna z Art. 20 CPR 2024/3110.
                </p>
              </div>
            </Container>
          </section>

          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ── FORM ── */}
              <div className="space-y-5">
                <div className="bg-slate-800/30 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-white mb-2">Dane producenta</h2>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Nazwa producenta *</label>
                    <input
                      type="text"
                      value={data.producerName}
                      onChange={(e) => update("producerName", e.target.value)}
                      placeholder="np. ABC Budowlana Sp. z o.o."
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Adres producenta</label>
                    <input
                      type="text"
                      value={data.producerAddress}
                      onChange={(e) => update("producerAddress", e.target.value)}
                      placeholder="np. ul. Przemyslowa 15, 00-001 Warszawa"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400/40"
                    />
                  </div>
                </div>

                <div className="bg-slate-800/30 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-white mb-2">Dane wyrobu</h2>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Nazwa wyrobu *</label>
                    <input
                      type="text"
                      value={data.productName}
                      onChange={(e) => update("productName", e.target.value)}
                      placeholder="np. Okno PVC 3-szybowe OKN-150"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Nr jednostki notyfikowanej</label>
                      <input
                        type="text"
                        value={data.notifiedBodyNumber}
                        onChange={(e) => update("notifiedBodyNumber", e.target.value)}
                        placeholder="np. 1234"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Rok (2 cyfry) *</label>
                      <input
                        type="text"
                        value={data.year}
                        onChange={(e) => update("year", e.target.value.replace(/\D/g, "").slice(0, 2))}
                        placeholder="26"
                        maxLength={2}
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Nr DoP&C *</label>
                      <input
                        type="text"
                        value={data.dopcNumber}
                        onChange={(e) => update("dopcNumber", e.target.value)}
                        placeholder="np. DoPC-2026-001"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Norma zharmonizowana *</label>
                      <input
                        type="text"
                        value={data.harmonizedStandard}
                        onChange={(e) => update("harmonizedStandard", e.target.value)}
                        placeholder="np. EN 14351-1:2006+A2:2016"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">
                      Deklarowane wlasciwosci uzytkowe (kazda w nowej linii)
                    </label>
                    <textarea
                      value={data.declaredProperties}
                      onChange={(e) => update("declaredProperties", e.target.value)}
                      placeholder={"Uw = 0,9 W/(m2K)\nRw = 35 dB\nKlasa 4 - przepuszczalnosc powietrza"}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400/40 resize-y"
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-slate-900 font-semibold rounded-xl hover:bg-amber-300 transition-colors text-sm"
                  >
                    <Printer className="w-4 h-4" />
                    Drukuj
                  </button>
                  <button
                    onClick={handleDownloadSvg}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Pobierz SVG
                  </button>
                  <button
                    onClick={() => setData(EMPTY)}
                    className="flex items-center gap-2 px-5 py-2.5 text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Wyczysc
                  </button>
                </div>
              </div>

              {/* ── PREVIEW ── */}
              <div>
                <div className="sticky top-28">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <h2 className="text-lg font-semibold text-white">Podglad etykiety</h2>
                  </div>
                  <div
                    ref={svgContainerRef}
                    className="bg-white rounded-2xl p-6 shadow-xl shadow-black/20"
                  >
                    <CeLabelPreview data={data} />
                  </div>
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                    Etykieta wygenerowana na podstawie Art. 20 CPR (UE) 2024/3110.
                    Producent odpowiada za poprawnosc i kompletnosc danych.
                    Litery CE muszą miec min. 5 mm wysokosci na wyrobie.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
}
