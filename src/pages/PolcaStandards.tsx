import React from "react";
import { PolcaHeader } from "../components/PolcaHeader";
import { PolcaFooter } from "../components/PolcaFooter";

export default function PolcaStandards() {
    return (
        <div className="polca-page">
            <PolcaHeader />

            <main className="bg-white py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-emerald-700 font-bold tracking-widest text-xs uppercase mb-3 block">
                            Ramy Normatywne
                        </span>
                        <h2 className="text-3xl font-bold text-slate-900 font-serif">
                            Standardyzacja i Walidacja
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
                            Pełna zgodność z architekturą prawną Unii Europejskiej (CPR,
                            Taksonomia, dyrektywy środowiskowe).
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6 font-serif">
                                System Jakości Danych (DQS)
                            </h3>
                            <p className="mb-6 text-slate-500 text-xs leading-relaxed text-justify">
                                System oceny jakości danych został zaimplementowany zgodnie z
                                wymaganiami normy{" "}
                                <strong>ISO 14044:2006 (pkt 4.2.3.6)</strong> oraz{" "}
                                <strong>EN 15804:2012+A2:2019 (pkt 6.3.7)</strong>. <br />
                                Kwantyfikacja jakości odbywa się przy użyciu wskaźnika{" "}
                                <strong>DQR</strong> (Data Quality Rating) wg metodyki PEF
                                (Product Environmental Footprint), w skali 1.0–5.0.
                            </p>
                            <table className="w-full text-xs text-left border border-slate-200 rounded-sm">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-3 border-b font-bold text-slate-600">
                                            Kryterium DQI
                                        </th>
                                        <th className="p-3 border-b font-bold text-slate-600">
                                            Wymóg Walidacyjny (Poziom 1)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white">
                                        <td className="p-3 border-b font-mono font-bold text-slate-700">
                                            TeR (Technological)
                                        </td>
                                        <td className="p-3 border-b text-slate-500">
                                            Zgodność technologiczna procesu wytwórczego.
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="p-3 border-b font-mono font-bold text-slate-700">
                                            GeR (Geographical)
                                        </td>
                                        <td className="p-3 border-b text-slate-500">
                                            Lokalizacja: Polska (PL) lub region RER.
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="p-3 border-b font-mono font-bold text-slate-700">
                                            TiR (Time-related)
                                        </td>
                                        <td className="p-3 border-b text-slate-500">
                                            Interwał czasowy &lt; 3 lat (dane pierwotne).
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-emerald-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                        Legislacja
                                    </span>
                                    <h4 className="font-bold text-slate-900 text-sm">
                                        Rozporządzenie CPR (Acquis)
                                    </h4>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed mb-4 text-justify">
                                    Repozytorium wspiera producentów w procesie adaptacji do
                                    rewizji{" "}
                                    <strong>Construction Products Regulation</strong>. Nowe
                                    przepisy wprowadzają obligatoryjność deklarowania parametrów
                                    środowiskowych (BWR 7 - Zrównoważone wykorzystanie zasobów
                                    naturalnych) w dokumentacji technicznej wyrobu.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm">
                                <h4 className="font-bold text-slate-900 mb-2 text-sm">
                                    Audyt Zewnętrzny
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed text-justify">
                                    Procedura walidacji danych obejmuje recenzję krytyczną
                                    (Critical Review) realizowaną przez niezależne jednostki
                                    weryfikujące, zgodnie z wytycznymi specyfikacji technicznej{" "}
                                    <strong>ISO/TS 14071:2016</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Format Prezentacji Danych */}
                    <div className="mt-16 pt-12 border-t border-slate-200">
                        <div className="text-center mb-12">
                            <span className="text-indigo-800 font-bold tracking-widest text-xs uppercase mb-3 block">
                                Interoperacyjność Systemowa
                            </span>
                            <h3 className="text-2xl font-bold text-slate-900 font-serif">
                                Format Prezentacji Danych
                            </h3>
                            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
                                Standardy techniczne zapisu danych w repozytorium (Backend) oraz
                                ich prezentacji w dokumentacji weryfikacyjnej (Frontend/Raport).
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            {/* Left: Database Structure (ISO 14048) */}
                            <div className="bg-slate-900 text-slate-300 p-8 rounded-sm font-mono text-xs relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-slate-800 px-3 py-1 rounded-bl-sm text-[10px] font-bold text-white">
                                    BAZA DANYCH (Machine Readable)
                                </div>
                                <h4 className="text-white font-bold text-sm mb-4 font-sans border-b border-slate-700 pb-2">
                                    Struktura ILCD / ISO/TS 14048
                                </h4>

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-emerald-500 block mb-1">
                                            &lt;processDataSet&gt;
                                        </span>
                                        <div className="pl-4 border-l border-slate-700 space-y-2">
                                            <div>
                                                <span className="text-blue-400">UUID:</span>{" "}
                                                "123e4567-e89b-..."
                                                <br />
                                                <span className="text-blue-400">Name:</span> "Cement CEM
                                                I 42,5R"
                                                <br />
                                                <span className="text-blue-400">Location:</span> "PL"
                                                <br />
                                                <span className="text-blue-400">Time:</span> "2025"
                                            </div>
                                            <div>
                                                <span className="text-purple-400 block">
                                                    &lt;exchanges&gt;
                                                </span>
                                                <div className="pl-4 text-slate-500">
                                                    &lt;exchange flow="GWP" amount="842" unit="kg" /&gt;
                                                    <br />
                                                    &lt;exchange flow="Energy" amount="3.2" unit="MJ"
                                                    /&gt;
                                                </div>
                                                <span className="text-purple-400">
                                                    &lt;/exchanges&gt;
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-emerald-500 mt-1 block">
                                            &lt;/processDataSet&gt;
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-800">
                                    <p className="mb-2">
                                        <span className="text-white font-bold">
                                            Standard wymiany:
                                        </span>{" "}
                                        ILCD XML (International Life Cycle Data System).
                                    </p>
                                    <p>
                                        <span className="text-white font-bold">
                                            Kompatybilność:
                                        </span>{" "}
                                        SimaPro, GaBi, openLCA, BIM (przez API).
                                    </p>
                                </div>
                            </div>

                            {/* Right: Document Presentation (EN 15804) */}
                            <div className="bg-white border border-slate-200 p-8 rounded-sm text-xs relative shadow-sm">
                                <div className="absolute top-0 right-0 bg-emerald-100 px-3 py-1 rounded-bl-sm text-[10px] font-bold text-emerald-800">
                                    DOKUMENTACJA (Human Readable)
                                </div>
                                <h4 className="text-slate-900 font-bold text-sm mb-4 font-sans border-b border-slate-100 pb-2">
                                    Raport EPD / Tabela Wyników
                                </h4>

                                <p className="text-slate-500 mb-4">
                                    Prezentacja wyników musi być zgodna z układem tabelarycznym
                                    zdefiniowanym w normie <strong>PN-EN 15804+A2</strong>.
                                </p>

                                <table className="w-full text-center border-collapse border border-slate-200 mb-4">
                                    <thead className="bg-slate-50 text-slate-700 font-bold">
                                        <tr>
                                            <th className="border border-slate-200 p-2 text-left">
                                                Wskaźnik
                                            </th>
                                            <th className="border border-slate-200 p-2">Jedn.</th>
                                            <th className="border border-slate-200 p-2 bg-emerald-50">
                                                A1-A3
                                            </th>
                                            <th className="border border-slate-200 p-2">C1-C4</th>
                                            <th className="border border-slate-200 p-2">D</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-600">
                                        <tr>
                                            <td className="border border-slate-200 p-2 text-left font-bold">
                                                GWP-total
                                            </td>
                                            <td className="border border-slate-200 p-2">kg CO2e</td>
                                            <td className="border border-slate-200 p-2 font-bold text-slate-900 bg-emerald-50">
                                                245.0
                                            </td>
                                            <td className="border border-slate-200 p-2">12.5</td>
                                            <td className="border border-slate-200 p-2 text-green-600">
                                                -5.2
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-slate-200 p-2 text-left">
                                                GWP-fossil
                                            </td>
                                            <td className="border border-slate-200 p-2">kg CO2e</td>
                                            <td className="border border-slate-200 p-2 bg-emerald-50">
                                                240.1
                                            </td>
                                            <td className="border border-slate-200 p-2">12.0</td>
                                            <td className="border border-slate-200 p-2">-4.8</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-slate-200 p-2 text-left">
                                                PENRE
                                            </td>
                                            <td className="border border-slate-200 p-2">MJ</td>
                                            <td className="border border-slate-200 p-2 bg-emerald-50">
                                                1200
                                            </td>
                                            <td className="border border-slate-200 p-2">45</td>
                                            <td className="border border-slate-200 p-2">-120</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p className="text-[10px] text-slate-400 italic">
                                    *Przykład prezentacji danych dla jednostki funkcjonalnej 1
                                    m3 betonu.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Competitive Advantage */}
                    <div className="mt-16 mb-16">
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase mb-2 block">
                                        Analiza Wpływu
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold font-serif mb-4">
                                        Czy dokładniejsze dane oznaczają gorszy wynik EPD?
                                    </h3>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-6 text-justify">
                                        Istnieje obawa, że uwzględnienie 100% procesów (metoda
                                        hybrydowa) zawyży ślad węglowy względem konkurencji
                                        stosującej uproszczone bazy (np. Ecoinvent). <br />
                                        <br />
                                        <strong>W praktyce jest odwrotnie.</strong> Precyzja danych
                                        poLCA pozwala wyeliminować "kary za niepewność" i
                                        konserwatywne założenia stosowane w bazach generycznych.
                                    </p>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs mt-0.5">
                                                X
                                            </div>
                                            <span className="text-slate-400">
                                                Dane Generyczne (Inne bazy): Średnia światowa + Narzut
                                                bezpieczeństwa (Worst-case).
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mt-0.5">
                                                ✓
                                            </div>
                                            <span className="text-white font-medium">
                                                Dane Specyficzne (poLCA): Rzeczywista technologia +
                                                Precyzyjny miks energetyczny.
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Visual Comparison Chart */}
                                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase text-center mb-6">
                                        Symulacja Wyniku GWP (Beton C30)
                                    </h4>

                                    {/* Competitor Bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400">
                                                Baza Generyczna (np. Ecoinvent RER)
                                            </span>
                                            <span className="text-white font-bold">285 kg CO2e</span>
                                        </div>
                                        <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden flex">
                                            <div
                                                className="bg-slate-500 h-full"
                                                style={{ width: "80%" }}
                                            ></div>
                                            <div
                                                className="bg-red-500 h-full"
                                                style={{ width: "20%" }}
                                                title="Narzut za brak precyzji"
                                            ></div>
                                        </div>
                                        <div className="text-[9px] text-red-400 mt-1 text-right">
                                            Wliczony narzut za niepewność danych (+20%)
                                        </div>
                                    </div>

                                    {/* poLCA Bar */}
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-emerald-400 font-bold">
                                                poLCA (Hybrid + Dynamic)
                                            </span>
                                            <span className="text-emerald-400 font-bold">
                                                245 kg CO2e
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden flex relative">
                                            <div
                                                className="bg-emerald-600 h-full"
                                                style={{ width: "75%" }}
                                            ></div>
                                            <div
                                                className="bg-blue-500 h-full opacity-50"
                                                style={{ width: "5%" }}
                                                title="Dodatek Hybrydowy (Usługi)"
                                            ></div>
                                            <div className="absolute right-[20%] top-0 h-full w-px bg-white/50"></div>
                                            <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                                                <span className="text-[9px] text-emerald-300 font-bold">
                                                    -14% (Zysk)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-[9px] text-emerald-500 mt-1 text-right">
                                            Brak narzutu + Zysk z precyzji energetycznej
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Background decoration */}
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </main>

            <PolcaFooter />
        </div>
    );
}
