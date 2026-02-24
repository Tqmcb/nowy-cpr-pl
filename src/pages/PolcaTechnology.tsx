import React from "react";
import { PolcaHeader } from "../components/PolcaHeader";
import { PolcaFooter } from "../components/PolcaFooter";

export default function PolcaTechnology() {
    return (
        <div className="polca-page">
            <PolcaHeader />

            <main className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-indigo-800 font-bold tracking-widest text-xs uppercase mb-3 block">
                            Innowacje Procesowe
                        </span>
                        <h2 className="text-3xl font-bold text-slate-900 font-serif">
                            Implementacja Metodyk Nowej Generacji
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
                            Szczegółowy opis techniczny i algorytmiczny wdrożenia metodyki
                            hybrydowej oraz analizy dynamicznej w strukturze bazy danych
                            poLCA.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                        {/* BLOCK 1: HYBRID IO-LCA */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-bold text-xl rounded-sm">
                                    IO
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 font-serif">
                                    Hybrid IO-LCA
                                </h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed text-justify">
                                Metoda hybrydowa (Input-Output LCA) rozwiązuje problem
                                niekompletności danych (błąd ucięcia) poprzez integrację dwóch
                                strumieni informacji. Tam, gdzie kończą się dane inżynierskie
                                (fizyczne), zaczynają się dane ekonomiczne (finansowe).
                            </p>

                            <div className="bg-slate-50 p-6 rounded-sm border border-slate-200">
                                <h4 className="font-bold text-slate-800 text-xs uppercase mb-4 tracking-wide">
                                    Algorytm Obliczeniowy
                                </h4>
                                <ol className="relative border-l border-slate-300 ml-3 space-y-6">
                                    <li className="pl-6 relative">
                                        <span className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-300 rounded-full"></span>
                                        <h5 className="font-bold text-slate-900 text-sm">
                                            Krok 1: Inwentaryzacja Fizyczna (Process-LCA)
                                        </h5>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Zbieramy dane o głównych surowcach (stal, cement, energia)
                                            w jednostkach fizycznych (kg, kWh). To pokrywa ok. 80-90%
                                            wpływu.
                                        </p>
                                    </li>
                                    <li className="pl-6 relative">
                                        <span className="absolute -left-1.5 top-1.5 w-3 h-3 bg-emerald-500 rounded-full"></span>
                                        <h5 className="font-bold text-emerald-800 text-sm">
                                            Krok 2: Analiza Luki Finansowej
                                        </h5>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Porównujemy koszt materiałów z całkowitym kosztem
                                            produkcji. Różnica (np. usługi prawne, marketing, IT) to
                                            "luka", której nie ma w zwykłym LCA.
                                        </p>
                                    </li>
                                    <li className="pl-6 relative">
                                        <span className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-300 rounded-full"></span>
                                        <h5 className="font-bold text-slate-900 text-sm">
                                            Krok 3: Mapowanie Macierzowe (IO Tables)
                                        </h5>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Brakujące wydatki mapujemy na sektory gospodarki wg
                                            klasyfikacji GUS (PKD/NACE). Mnożymy kwotę (PLN) przez
                                            wskaźnik emisji sektora (kg CO2/PLN).
                                        </p>
                                    </li>
                                    <li className="pl-6 relative">
                                        <span className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-900 rounded-full"></span>
                                        <h5 className="font-bold text-slate-900 text-sm">
                                            Wynik: Kompletny Ślad Węglowy
                                        </h5>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Suma emisji fizycznych i ekonomicznych daje wynik wolny od
                                            błędu ucięcia.
                                        </p>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        {/* BLOCK 2: DYNAMIC LCA */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-emerald-600 text-white flex items-center justify-center font-bold text-xl rounded-sm">
                                    1h
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 font-serif">
                                    Dynamiczne LCA (Time-Resolved)
                                </h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed text-justify">
                                Metoda dynamiczna odchodzi od statycznych średnich rocznych na
                                rzecz analizy w czasie rzeczywistym. Pozwala to na premiowanie
                                zakładów wykorzystujących energię w momentach wysokiej generacji
                                OZE.
                            </p>

                            <div className="bg-emerald-50 p-6 rounded-sm border border-emerald-100">
                                <h4 className="font-bold text-emerald-900 text-xs uppercase mb-4 tracking-wide">
                                    Schemat Wdrożenia
                                </h4>
                                <div className="space-y-4">
                                    <div className="bg-white p-3 rounded border border-emerald-200">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-700">
                                                API Operatora (PSE)
                                            </span>
                                            <span className="text-[9px] font-mono text-slate-400">
                                                DATA SOURCE
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500">
                                            Pobieranie danych o strukturze paliwowej (węgiel, wiatr,
                                            PV) w interwałach 15-minutowych.
                                        </p>
                                    </div>
                                    <div className="flex justify-center text-emerald-300">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                            />
                                        </svg>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-emerald-200">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-700">
                                                Profil Odbiorcy (AMI)
                                            </span>
                                            <span className="text-[9px] font-mono text-slate-400">
                                                USER INPUT
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500">
                                            Nałożenie profilu zużycia energii fabryki na profil
                                            emisyjności sieci.
                                        </p>
                                    </div>
                                    <div className="flex justify-center text-emerald-300">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                            />
                                        </svg>
                                    </div>
                                    <div className="bg-slate-900 p-3 rounded border border-slate-800">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-white">
                                                Specific EPD Data
                                            </span>
                                            <span className="text-[9px] font-mono text-emerald-400">
                                                OUTPUT
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400">
                                            Wygenerowanie unikalnego wskaźnika GWP dla danej partii
                                            produkcyjnej.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <PolcaFooter />
        </div>
    );
}
