import React, { useState, useRef, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Container } from "./Container";
import { useAuth } from "../utils/AuthContextUnified";
import {
  Settings,
  Database,
  Download,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Search,
  FileText,
  Award,
  BookOpen,
  Home,
  LayoutDashboard
} from "lucide-react";

export function Header() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { user, isAuthenticated, isLoading } = auth;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

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
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="cursor-pointer group flex items-center gap-1"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-orange-300 transition-all duration-300">
                NowyCPR
              </span>
              <span className="text-2xl font-bold text-slate-400 group-hover:text-slate-300 transition-colors duration-300">.pl</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse ml-1"></div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink to="/product-search" className={navLinkClass}>
              <Search className="w-4 h-4" />
              Wyszukiwarka CPR
            </NavLink>
            <NavLink to="/documents" className={navLinkClass}>
              <FileText className="w-4 h-4" />
              Dokumenty
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              <Award className="w-4 h-4" />
              Usługi
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              <BookOpen className="w-4 h-4" />
              Blog
            </NavLink>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Admin Dropdown */}
            {isAuthenticated && user?.email?.endsWith('@multicert.pl') && (
              <div className="relative" ref={adminMenuRef}>
                <button
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  Admin
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${adminMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {adminMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 glass-card py-2 shadow-xl animate-fade-in">
                    {[
                      { path: "/admin-panel", label: "Panel Administracyjny", icon: Settings },
                      { path: "/admin-supabase-config", label: "Konfiguracja Supabase", icon: Database },
                      { path: "/admin-data-import", label: "Import danych", icon: Download }
                    ].map((item) => (
                      <div
                        key={item.path}
                        className="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer transition-all duration-200 flex items-center gap-3"
                        onClick={() => {
                          navigate(item.path);
                          setAdminMenuOpen(false);
                        }}
                      >
                        <item.icon className="w-4 h-4 text-slate-400" />
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* User Menu / Login */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-slate-900">
                    {(user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-white max-w-[120px] truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Użytkownik'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 glass-card py-2 shadow-xl animate-fade-in">
                    <div
                      className="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer transition-all duration-200 flex items-center gap-3"
                      onClick={() => {
                        navigate("/client-portal");
                        setUserMenuOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Portal Klienta
                    </div>
                    <div className="border-t border-white/10 my-1"></div>
                    <div
                      className="px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 cursor-pointer transition-all duration-200 flex items-center gap-3"
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Wyloguj się
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="btn-premium px-6 py-2.5 rounded-full text-sm font-semibold text-slate-900"
              >
                Zaloguj się
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
          <div className="glass-card p-6 space-y-4">
            {[
              { path: "/", label: "Strona Główna", icon: Home },
              { path: "/product-search", label: "Wyszukiwarka CPR", icon: Search },
              { path: "/documents", label: "Dokumenty", icon: FileText },
              { path: "/services", label: "Usługi", icon: Award },
              { path: "/blog", label: "Blog", icon: BookOpen }
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

            {/* Admin section in mobile */}
            {isAuthenticated && user?.email?.endsWith('@multicert.pl') && (
              <div className="pt-4 mt-4 border-t border-white/10">
                <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold mb-3 px-4 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Panel Admina
                </p>
                {[
                  { path: "/admin-panel", label: "Panel Administracyjny", icon: Settings },
                  { path: "/admin-supabase-config", label: "Konfiguracja Supabase", icon: Database },
                  { path: "/admin-data-import", label: "Import danych", icon: Download }
                ].map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-4 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}

            {/* User section in mobile */}
            <div className="pt-4 mt-4 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/client-portal"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                  >
                    <User className="w-5 h-5" />
                    Portal Klienta
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 text-left py-3 px-4 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    Wyloguj się
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-premium py-3 rounded-xl text-sm font-semibold text-slate-900"
                >
                  Zaloguj się
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
