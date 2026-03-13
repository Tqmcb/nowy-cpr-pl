import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Container } from "./Container";
import {
  Menu,
  X,
  Search,
  FileText,
  BookOpen,
  Home,
  Building2,
  Briefcase,
  Newspaper,
  Calendar,
} from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 px-1 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive
      ? "text-amber-400"
      : "text-slate-300 hover:text-white"
    } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-amber-400 after:to-orange-500 after:transition-all after:duration-300 ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "py-3 bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
        : "py-5 bg-transparent"
        }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-slate-900 focus:font-semibold focus:rounded-lg focus:outline-none"
      >
        Przejdź do treści głównej
      </a>
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="cursor-pointer group flex items-center gap-1">
            <div className="relative">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-orange-300 transition-all duration-300">
                NowyCPR
              </span>
              <span className="text-2xl font-bold text-slate-400 group-hover:text-slate-300 transition-colors duration-300">.pl</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse ml-1"></div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Nawigacja główna">
            <NavLink to="/product-search" className={navLinkClass}>
              <Search className="w-4 h-4" />
              Wymagania
            </NavLink>
            <NavLink to="/wyroby" className={navLinkClass}>
              <Building2 className="w-4 h-4" />
              Katalog wyrobów
            </NavLink>
            <NavLink to="/documents" className={navLinkClass}>
              <FileText className="w-4 h-4" />
              Wzory
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              <Briefcase className="w-4 h-4" />
              Usługi
            </NavLink>
            <NavLink to="/harmonogram" className={navLinkClass}>
              <Calendar className="w-4 h-4" />
              Harmonogram
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              <Newspaper className="w-4 h-4" />
              Aktualności
            </NavLink>
          </nav>


          {/* Mobile Menu Button */}
          <button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
        >
          <div className="glass-card p-6 space-y-4">
            {[
              { path: "/", label: "Strona Główna", icon: Home },
              { path: "/product-search", label: "Wymagania", icon: Search },
              { path: "/wyroby", label: "Katalog wyrobów", icon: Building2 },
              { path: "/documents", label: "Wzory", icon: FileText },
              { path: "/services", label: "Usługi", icon: Briefcase },
              { path: "/harmonogram", label: "Harmonogram", icon: Calendar },
              { path: "/blog", label: "Aktualności", icon: Newspaper }
            ].map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3 px-4 rounded-lg text-base font-medium transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-amber-400/20 to-orange-500/20 text-amber-400 border-l-2 border-amber-400'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}

          </div>
        </div>
      </Container>
    </header>
  );
}
