import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Container } from "./Container";
import { ScrollProgressBar } from "./ScrollProgressBar";
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
      isActive ? "" : "hover:text-black"
    } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-200 ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;
  const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    color: isActive ? "oklch(55% .22 27)" : "oklch(42% .02 264)",
  });

  return (
    <>
    <header
      className="fixed top-0 left-0 right-0 z-50 py-3 transition-shadow duration-200"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
      }}
    >
      {/* Brand-red top rule — sygnatura Multicert */}
      <div className="absolute top-0 left-0 h-[3px] w-20" style={{ backgroundColor: "oklch(55% .22 27)" }} />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:font-semibold focus:outline-none" style={{ backgroundColor: "oklch(55% .22 27)", color: "white" }}>
        Przejdź do treści głównej
      </a>
      <Container>
        <div className="flex items-center justify-between">
          <Link to="/" className="cursor-pointer group flex items-center gap-2.5">
            <div className="flex items-baseline">
              <span className="text-xl tracking-tight font-serif italic transition-colors duration-200" style={{ color: "oklch(20% .03 264)", fontWeight: 600 }}>Nowy</span>
              <span className="text-xl tracking-tight font-serif transition-colors duration-200" style={{ color: "oklch(20% .03 264)", fontWeight: 600 }}>CPR</span>
              <span className="text-xl font-serif" style={{ color: "oklch(55% .22 27)", fontWeight: 600 }}>.pl</span>
            </div>
            <div className="h-5 w-px hidden sm:block" style={{ backgroundColor: "oklch(86% .012 264)" }}></div>
            <span className="text-[10px] leading-tight hidden sm:block uppercase tracking-[0.15em] font-semibold" style={{ color: "oklch(60% .015 264)" }}>Portal<br />CPR 2024/3110</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5" aria-label="Nawigacja główna">
            <NavLink to="/wyszukiwarka" className={navLinkClass} style={navLinkStyle}><Search className="w-3.5 h-3.5" />Wymagania</NavLink>
            <NavLink to="/wyroby" className={navLinkClass} style={navLinkStyle}><Building2 className="w-3.5 h-3.5" />Katalog wyrobów</NavLink>
            <NavLink to="/documents" className={navLinkClass} style={navLinkStyle}><FileText className="w-3.5 h-3.5" />Wzory</NavLink>

            <div ref={toolsRef} className="relative">
              <button onClick={() => setToolsOpen(v => !v)} className="py-1.5 px-1 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 hover:text-black" style={{ color: toolsOpen ? "oklch(55% .22 27)" : "oklch(42% .02 264)" }}>
                <Wrench className="w-3.5 h-3.5" />Narzędzia
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 py-1 bg-white border shadow-lg" style={{ borderColor: "oklch(92% .008 264)", borderRadius: "2px" }}>
                  {[
                    { path: "/sciezka-ce", label: "Ścieżka do CE", icon: Compass, desc: "Kreator checklisty" },
                    { path: "/generator-ce", label: "Generator etykiety CE", icon: Stamp, desc: "Podgląd i wydruk" },
                    { path: "/harmonogram", label: "Harmonogram CPR", icon: Calendar, desc: "Kluczowe daty" },
                    { path: "/faq", label: "FAQ", icon: HelpCircle, desc: "Pytania i odpowiedzi" },
                  ].map(item => (
                    <NavLink key={item.path} to={item.path} onClick={() => setToolsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-slate-50">
                      <item.icon className="w-4 h-4 shrink-0" style={{ color: "oklch(55% .22 27)" }} />
                      <div><div className="font-medium" style={{ color: "oklch(20% .03 264)" }}>{item.label}</div><div className="text-xs" style={{ color: "oklch(60% .015 264)" }}>{item.desc}</div></div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/services" className={navLinkClass} style={navLinkStyle}><Briefcase className="w-3.5 h-3.5" />Usługi</NavLink>
            <NavLink to="/blog" className={navLinkClass} style={navLinkStyle}><Newspaper className="w-3.5 h-3.5" />Aktualności</NavLink>
          </nav>

          <button className="lg:hidden w-9 h-9 flex items-center justify-center transition-colors" style={{ border: "1px solid oklch(86% .012 264)", borderRadius: "2px" }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"} aria-expanded={mobileMenuOpen} aria-controls="mobile-menu">
            {mobileMenuOpen ? <X className="w-5 h-5" style={{ color: "oklch(20% .03 264)" }} /> : <Menu className="w-5 h-5" style={{ color: "oklch(20% .03 264)" }} />}
          </button>
        </div>

        <div id="mobile-menu" className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
          <div className="pt-3 pb-2 space-y-0.5" style={{ borderTop: "1px solid oklch(92% .008 264)" }}>
            {[
              { path: "/", label: "Strona Główna", icon: Home },
              { path: "/wyszukiwarka", label: "Wymagania", icon: Search },
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
                className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium transition-colors hover:bg-slate-50"
                style={({ isActive }: { isActive: boolean }) => ({
                  color: isActive ? "oklch(55% .22 27)" : "oklch(42% .02 264)",
                  borderLeft: isActive ? "2px solid oklch(55% .22 27)" : "2px solid transparent",
                })}>
                <item.icon className="w-4 h-4" />{item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </Container>
    </header>
    </>
  );
}
