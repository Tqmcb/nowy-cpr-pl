import React, { useState } from "react";
import { PolcaHeader } from "../components/PolcaHeader";
import { PolcaFooter } from "../components/PolcaFooter";

export default function PolcaLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Moduł logowania w trybie demonstracyjnym.");
    };

    return (
        <div className="polca-page">
            <PolcaHeader />

            <main className="bg-slate-50 flex flex-col justify-center py-20 min-h-[60vh]">
                <div className="max-w-md mx-auto w-full bg-white p-8 rounded-sm shadow-lg border border-slate-200">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-slate-900 font-serif">
                            Panel Autoryzacji
                        </h2>
                        <p className="text-xs text-slate-500 mt-2">
                            Dostęp zastrzeżony dla jednostek certyfikujących i badawczych.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Identyfikator Służbowy
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all text-sm"
                                placeholder="user@domain.gov.pl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Klucz Dostępu
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-emerald-800 text-white font-bold py-3 rounded-sm transition-all text-xs uppercase tracking-widest"
                        >
                            Zaloguj
                        </button>
                    </form>

                    <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                        <a
                            href="#"
                            className="text-slate-600 hover:text-slate-900 hover:underline"
                        >
                            Procedura uzyskania dostępu API
                        </a>
                    </div>
                </div>
            </main>

            <PolcaFooter />
        </div>
    );
}
