import React from "react";
import { PolcaHeader } from "../components/PolcaHeader";
import { PolcaFooter } from "../components/PolcaFooter";

export default function PolcaNews() {
    const newsItems = [
        {
            date: "15.01.2026",
            category: "Raport KOBiZE",
            title: "Aktualizacja wskaźników emisyjności dla KSE",
            description:
                "Opublikowano zrewidowane wskaźniki emisyjności dla Krajowego Systemu Elektroenergetycznego. Dane uwzględniają aktualną strukturę paliwową oraz import energii, zgodnie z metodyką bilansową.",
        },
        {
            date: "02.12.2025",
            category: "Interoperacyjność",
            title: "Implementacja standardu ILCD+EPD",
            description:
                "Zakończono proces integracji formatu wymiany danych XML zgodnego z międzynarodowym systemem węzłów danych LCA. Umożliwia to bezpośredni transfer danych do oprogramowania klasy BIM.",
        },
    ];

    return (
        <div className="polca-page">
            <PolcaHeader />

            <main className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 font-serif border-b border-slate-200 pb-4">
                        Komunikaty Oficjalne
                    </h2>
                    <div className="space-y-8">
                        {newsItems.map((item, index) => (
                            <article
                                key={index}
                                className="flex flex-col md:flex-row gap-8 pb-8 border-b border-slate-100 items-start"
                            >
                                <div className="w-full md:w-32 flex flex-col pt-1">
                                    <span className="text-sm font-bold text-slate-900">
                                        {item.date}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider mt-1">
                                        {item.category}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 hover:text-emerald-700 cursor-pointer font-serif">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-600 mb-3 text-xs leading-relaxed text-justify">
                                        {item.description}
                                    </p>
                                    <a
                                        href="#"
                                        className="text-slate-800 font-bold text-[10px] uppercase tracking-wide border-b border-slate-300 hover:border-emerald-600 transition-colors"
                                    >
                                        Pobierz Dokument
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </main>

            <PolcaFooter />
        </div>
    );
}
