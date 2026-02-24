import React from "react";
import { useNavigate } from "react-router-dom";

export function PolcaFooter() {
    const navigate = useNavigate();

    return (
        <footer className="bg-slate-900 text-slate-400 py-16 text-xs border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
                    <div className="col-span-2 lg:col-span-2">
                        <div
                            className="flex items-center mb-6 cursor-pointer"
                            onClick={() => navigate("/polca")}
                        >
                            <div className="w-6 h-6 bg-emerald-700 rounded-sm mr-3 flex items-center justify-center text-white font-serif font-bold">
                                P
                            </div>
                            <span className="text-xl font-bold text-white font-serif">
                                po<span className="text-emerald-600">LCA</span>
                            </span>
                        </div>
                        <p className="max-w-xs text-slate-500 mb-6 leading-relaxed text-justify">
                            Narodowe Repozytorium Danych Środowiskowych. Infrastruktura
                            cyfrowa wspierająca procesy dekarbonizację gospodarki narodowej,
                            zgodnie z założeniami Europejskiego Zielonego Ładu.
                            <br />
                            <br />
                            <a
                                href="https://www.polca.org.pl"
                                className="text-emerald-600 hover:text-white transition-colors font-bold"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                www.polca.org.pl
                            </a>
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[10px]">
                            Zasoby Danych
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => navigate("/polca/catalog")}
                                    className="hover:text-white transition-colors text-left"
                                >
                                    Sektor Energetyczny
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/polca/catalog")}
                                    className="hover:text-white transition-colors text-left"
                                >
                                    Przemysł Budowlany
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/polca/catalog")}
                                    className="hover:text-white transition-colors text-left"
                                >
                                    Agro-Przemysł
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[10px]">
                            Baza Wiedzy
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => navigate("/polca/standards")}
                                    className="hover:text-white transition-colors text-left"
                                >
                                    Metodyka PEF (KE)
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/polca/standards")}
                                    className="hover:text-white transition-colors text-left"
                                >
                                    Normy PN-EN 15804
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/polca/standards")}
                                    className="hover:text-white transition-colors text-left"
                                >
                                    Taksonomia UE
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[10px]">
                            Kontakt Instytucjonalny
                        </h4>
                        <ul className="space-y-3 font-mono text-[11px]">
                            <li className="flex items-center gap-2">biuro@polca.org.pl</li>
                            <li className="flex items-center gap-2">+48 22 555 00 00</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 text-center md:text-left text-[10px] text-slate-600 flex flex-col md:flex-row justify-between items-center uppercase tracking-wide">
                    <p>
                        &copy; 2026 poLCA (www.polca.org.pl). Wszelkie prawa zastrzeżone.
                    </p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">
                            Nota Prawna
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Deklaracja Dostępności (WCAG)
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
