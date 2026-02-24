import React, { useState } from "react";
import { PolcaHeader } from "../components/PolcaHeader";
import { PolcaFooter } from "../components/PolcaFooter";

export default function PolcaCatalog() {
    const [selectedCategories, setSelectedCategories] = useState({
        energy: true,
        construction: true,
        transport: false,
    });

    const [selectedStandard, setSelectedStandard] = useState("PN-EN 15804+A2 (EPD)");

    const datasets = [
        {
            id: "PL-EL-LV-2025-A2",
            name: "Energy Mix PL Low Voltage (2025)",
            unit: "1 kWh",
            gwp: "0.712",
            dqr: "1.2 (Klasa I)",
            status: "Zweryfikowano",
        },
        {
            id: "PL-CEM-I-425-AVG",
            name: "Cement CEM I 42,5R (Avg PL)",
            unit: "1 kg",
            gwp: "0.842",
            dqr: "1.4 (Klasa I)",
            status: "Zweryfikowano",
        },
        {
            id: "PL-CONC-C30-REINF",
            name: "Beton C30/37 (Zbrojony)",
            unit: "1 m3",
            gwp: "298.5",
            dqr: "1.8 (Klasa I)",
            status: "Zweryfikowano",
        },
    ];

    return (
        <div className="polca-page">
            <PolcaHeader />

            <main className="bg-slate-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 font-serif">
                                Katalog Danych Środowiskowych
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Rejestr procesów jednostkowych zweryfikowanych pod kątem
                                zgodności z PN-EN 15804.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wide hover:bg-slate-50 transition-colors">
                                Eksport XML
                            </button>
                            <button className="bg-slate-800 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wide hover:bg-slate-900 transition-colors">
                                Dokumentacja API
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <div className="w-full lg:w-64 flex-shrink-0">
                            <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm sticky top-32">
                                <h3 className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-widest border-b border-slate-100 pb-2">
                                    Parametry Filtracji
                                </h3>

                                <div className="mb-6">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-3">
                                        Kategoria Procesu
                                    </label>
                                    <div className="space-y-2.5">
                                        <label className="flex items-center group cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-3.5 h-3.5 rounded-sm border-slate-300 text-emerald-700 focus:ring-emerald-700"
                                                checked={selectedCategories.energy}
                                                onChange={(e) =>
                                                    setSelectedCategories({
                                                        ...selectedCategories,
                                                        energy: e.target.checked,
                                                    })
                                                }
                                            />
                                            <span className="ml-3 text-xs text-slate-600 font-medium">
                                                Energetyka (342)
                                            </span>
                                        </label>
                                        <label className="flex items-center group cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-3.5 h-3.5 rounded-sm border-slate-300 text-emerald-700 focus:ring-emerald-700"
                                                checked={selectedCategories.construction}
                                                onChange={(e) =>
                                                    setSelectedCategories({
                                                        ...selectedCategories,
                                                        construction: e.target.checked,
                                                    })
                                                }
                                            />
                                            <span className="ml-3 text-xs text-slate-600 font-medium">
                                                Budownictwo (450)
                                            </span>
                                        </label>
                                        <label className="flex items-center group cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-3.5 h-3.5 rounded-sm border-slate-300 text-emerald-700 focus:ring-emerald-700"
                                                checked={selectedCategories.transport}
                                                onChange={(e) =>
                                                    setSelectedCategories({
                                                        ...selectedCategories,
                                                        transport: e.target.checked,
                                                    })
                                                }
                                            />
                                            <span className="ml-3 text-xs text-slate-600 font-medium">
                                                Transport (120)
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-3">
                                        Standard Weryfikacji
                                    </label>
                                    <select
                                        className="w-full border border-slate-300 rounded-sm p-2 text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none text-slate-700 font-medium"
                                        value={selectedStandard}
                                        onChange={(e) => setSelectedStandard(e.target.value)}
                                    >
                                        <option>PN-EN 15804+A2 (EPD)</option>
                                        <option>PEF (Product Footprint)</option>
                                        <option>ISO 14040 Compliant</option>
                                    </select>
                                </div>

                                <button className="w-full bg-slate-900 text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors">
                                    Aktualizuj Widok
                                </button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="flex-grow">
                            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto custom-scroll">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wide">
                                            <tr>
                                                <th className="px-6 py-4">
                                                    Identyfikator Procesu (UUID)
                                                </th>
                                                <th className="px-6 py-4">Jednostka Funkcjonalna</th>
                                                <th className="px-6 py-4">
                                                    GWP-total{" "}
                                                    <span className="normal-case tracking-normal text-slate-400">
                                                        (kg CO2e)
                                                    </span>
                                                </th>
                                                <th className="px-6 py-4">Jakość (DQR)</th>
                                                <th className="px-6 py-4">Status Walidacji</th>
                                                <th className="px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {datasets.map((dataset, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-slate-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-800">
                                                            {dataset.name}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                                                            {dataset.id}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded-sm">
                                                            {dataset.unit}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                                                        {dataset.gwp}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 font-medium border border-emerald-100">
                                                            {dataset.dqr}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-emerald-700 font-bold flex items-center">
                                                            <svg
                                                                className="w-3 h-3 mr-1"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                    clipRule="evenodd"
                                                                ></path>
                                                            </svg>
                                                            {dataset.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-slate-400 hover:text-slate-900 cursor-pointer font-bold">
                                                        PDF &darr;
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
