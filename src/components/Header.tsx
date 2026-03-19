import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Container } from "./Container";
import {
  Menu, X, Search, FileText, Home, Building2,
  Briefcase, Newspaper, Calendar, HelpCircle,
  Compass, Stamp, ChevronDown, Wrench,
} from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-1.5 px-1 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
      isActive ? "text-amber-300" : "text-slate-300 hover:text-white"
    } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-200 ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2.5 shadow-md" : "py-4"}`}
      style={{ backgroundColor: "#0d2137" }}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-slate-900 focus:font-semibold focus:rounded focus:outline-none">
        Przejdź do treści głównej
      </a>
      <Container>
        <div className="flex items-center justify-between">
          <Link to="/" className="cursor-pointer group flex items-center gap-2.5">
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors duration-200">NowyCPR</span>
              <span className="text-xl font-bold text-slate-500">.pl</span>
            </div>
            <div className="h-5 w-px bg-slate-600 hidden sm:block"></div>
            <span className="text-[11px] text-slate-400 leading-tight hidden sm:block uppercase tracking-wider">Portal<br />CPR 2024/3110</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5" aria-label="Nawigacja główna">
            <NavLink to="/product-search" className={navLinkClass}><Search className="w-3.5 h-3.5" />Wymagania</NavLink>
            <NavLink to="/wyroby" className={navLinkClass}><Building2 className="w-3.5 h-3.5" />Katalog wyrobów</NavLink>
            <NavLink to="/documents" className={navLinkClass}><FileText className="w-3.5 h-3.5" />Wzory</NavLink>

            <div ref={toolsRef} className="relative">
              <button onClick={() => setToolsOpen(v => !v)} className={`py-1.5 px-1 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${toolsOpen ? "text-amber-300" : "text-slate-300 hover:text-white"}`}>
                <Wrench className="w-3.5 h-3.5" />Narzędzia
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 py-1 bg-white border border-slate-200 rounded shadow-lg">
                  {[
                    { path: "/sciezka-ce", label: "Ścieżka do CE", icon: Compass, desc: "Kreator checklisty" },
                    { path: "/generator-ce", label: "Generator etykiety CE", icon: Stamp, desc: "Podgląd i wydruk" },
                    { path: "/harmonogram", label: "Harmonogram CPR", icon: Calendar, desc: "Kluczowe daty" },
                    { path: "/faq", label: "FAQ", icon: HelpCircle, desc: "Pytania i odpowiedzi" },
                  ].map(item => (
                    <NavLink key={item.path} to={item.path} onClick={() => setToolsOpen(false)}
                      className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive ? "text-[#1a56a0] bg-blue-50 border-l-2 border-[#1a56a0]" : "text-slate-700 hover:text-[#1a56a0] hover:bg-slate-50"}`}>
                      <item.icon className="w-4 h-4 shrink-0 text-[#1a56a0]" />
                      <div><div className="font-medium">{item.label}</div><div className="text-xs text-slate-400">{item.desc}</div></div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/services" className={navLinkClass}><Briefcase className="w-3.5 h-3.5" />Usługi</NavLink>
            <NavLink to="/blog" className={navLinkClass}><Newspaper className="w-3.5 h-3.5" />Aktualności</NavLink>
          </nav>

          <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded border border-slate-600 hover:border-slate-400 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"} aria-expanded={mobileMenuOpen} aria-controls="mobile-menu">
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        <div id="mobile-menu" className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
          <div className="border-t border-slate-700 pt-3 pb-2 space-y-0.5">
            {[
              { path: "/", label: "Strona Główna", icon: Home },
              { path: "/product-search", label: "Wymagania", icon: Search },
              { path: "/wyroby", label: "Katalog wyrobów", icon: Building2 },
              { path: "/documents", label: "Wzory", icon: FileText },
              { path: "/services", label: "Usługi", icon: Briefcase },
              { path: "/harmonogram", label: "Harmonogram", icon: Calendar },
              { path: "/faq", label: "FAQ", icon: HelpCircle },
              { path: "/sciezka-ce", label: "Ścieżka CE", icon: Compass },
              { path: "/generator-ce", label: "Generator CE", icon: Stamp },
              { path: "/blog", label: "Aktualności", icon: Newspaper },
            ].map(item => (
              <NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 py-2.5 px-3 rounded text-sm font-medium transition-colors ${isActive ? "bg-[#1a3d6b] text-amber-300 border-l-2 border-amber-400" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}>
                <item.icon className="w-4 h-4" />{item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </Container>
    </header>
  );
}
