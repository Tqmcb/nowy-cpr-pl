import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

export function PolcaHeader() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `nav-link px-5 py-2 text-xs font-semibold rounded-sm uppercase tracking-wide transition-all ${isActive
            ? "active text-emerald-900 bg-slate-100 font-bold"
            : "text-slate-600 hover:text-slate-900"
        }`;

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            {/* Top Bar */}
            <div className="bg-slate-900 text-slate-300 text-[10px] uppercase tracking-widest font-semibold py-2 border-b border-slate-800 sticky top-0 z-[60]">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <span className="flex items-center text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                            Status Systemu: Operacyjny
                        </span>
                        <span className="hidden sm:inline text-slate-500">
                            Wersja Bazy: 3.2.1 (REV-2026-01)
                        </span>
                    </div>
                    <div className="flex space-x-6">
                        <button
                            onClick={() => navigate("/polca/standards")}
                            className="hover:text-white transition-colors"
                        >
                            CPR Acquis
                        </button>
                        <button
                            onClick={() => navigate("/polca/standards")}
                            className="hover:text-white transition-colors"
                        >
                            PN-EN ISO 14040:2009
                        </button>
                        <span className="text-slate-700">|</span>
                        <button
                            onClick={() => navigate("/polca/login")}
                            className="text-white hover:text-emerald-400 flex items-center gap-1 transition-colors"
                        >
                            Panel Ekspercki
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="sticky top-[32px] w-full z-50 glass-nav transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div
                            className="flex items-center cursor-pointer group"
                            onClick={() => navigate("/polca")}
                        >
                            <div className="relative w-10 h-10 mr-3">
                                <div className="absolute inset-0 bg-emerald-700 rounded-sm transform rotate-3 transition-transform group-hover:rotate-6 opacity-10"></div>
                                <div className="absolute inset-0 bg-slate-900 rounded-sm flex items-center justify-center text-white shadow-sm border border-slate-700">
                                    <span className="font-serif font-bold text-lg">P</span>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none font-serif">
                                    po<span className="text-emerald-700">LCA</span>
                                </span>
                                <span className="text-[9px] text-slate-500 uppercase tracking-[0.15em] font-medium mt-0.5">
                                    National Environmental Repository
                                </span>
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex space-x-1 items-center bg-white border border-slate-200 p-1 rounded-md shadow-sm">
                            <NavLink to="/polca" end className={navLinkClass}>
                                Start
                            </NavLink>
                            <NavLink to="/polca/catalog" className={navLinkClass}>
                                Katalog Danych
                            </NavLink>
                            <NavLink to="/polca/technology" className={navLinkClass}>
                                Technologia
                            </NavLink>
                            <NavLink to="/polca/standards" className={navLinkClass}>
                                Standardyzacja
                            </NavLink>
                            <NavLink to="/polca/news" className={navLinkClass}>
                                Komunikaty
                            </NavLink>
                        </div>

                        <div className="hidden lg:flex items-center space-x-4">
                            <button
                                onClick={() => navigate("/polca/login")}
                                className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-md font-medium text-xs uppercase tracking-wide transition-all border border-slate-700 shadow-sm"
                            >
                                Autoryzacja
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 text-slate-600"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden pb-4 border-t border-slate-100 bg-white/95 backdrop-blur-xl absolute left-0 right-0 px-4 shadow-lg">
                            <div className="flex flex-col space-y-2 mt-4">
                                <button
                                    onClick={() => {
                                        navigate("/polca");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-left px-4 py-3 bg-slate-50 rounded-sm text-sm font-medium border border-slate-100"
                                >
                                    Start
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/polca/catalog");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-left px-4 py-3 bg-slate-50 rounded-sm text-sm font-medium border border-slate-100"
                                >
                                    Katalog Danych
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/polca/technology");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-left px-4 py-3 bg-slate-50 rounded-sm text-sm font-medium border border-slate-100"
                                >
                                    Technologia
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/polca/standards");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-left px-4 py-3 bg-slate-50 rounded-sm text-sm font-medium border border-slate-100"
                                >
                                    Standardyzacja
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}
