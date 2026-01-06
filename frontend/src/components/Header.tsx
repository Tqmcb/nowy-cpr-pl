import React, { useState, useRef, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Container } from "./Container";
import { useAuth } from "../utils/AuthContextUnified";
import { signOut } from "../utils/authHelpers";


export function Header() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { user, isAuthenticated, isLoading } = auth;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close admin and user menus when clicking outside
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Use signOut function from unified auth context
const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  return (
    <header className="py-4 border-b border-gray-200">
      <Container>
        <div className="flex items-center justify-between">
          <div 
            className="text-xl font-bold cursor-pointer flex items-center" 
            onClick={() => navigate("/")}
          >
            <span className="text-gray-800">NowyCPR</span>
            <span className="text-gray-500">.pl</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <li className="py-1">
              <NavLink 
                to="/Products" 
                className={({ isActive }) =>
                  isActive ? "text-primary font-semibold" : "text-gray-600 hover:text-primary transition-colors"
                }
              >
                Wyszukiwarka CPR 2024
              </NavLink>
            </li>
            <li className="py-1">
              <NavLink 
                to="/Documents" 
                className={({ isActive }) =>
                  isActive ? "text-primary font-semibold" : "text-gray-600 hover:text-primary transition-colors"
                }
              >
                Dokumenty
              </NavLink>
            </li>
            <li className="py-1">
              <NavLink 
                to="/Services" 
                className={({ isActive }) =>
                  isActive ? "text-primary font-semibold" : "text-gray-600 hover:text-primary transition-colors"
                }
              >
                Usługi certyfikacyjne
              </NavLink>
            </li>
            <li className="py-1">
              <NavLink 
                to="/Blog" 
                className={({ isActive }) =>
                  isActive ? "text-primary font-semibold" : "text-gray-600 hover:text-primary transition-colors"
                }
              >
                Blog
              </NavLink>
            </li>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {/* Admin dropdown - only visible to admin users */}
            {isAuthenticated && user?.email?.endsWith('@multicert.pl') && (
              <div className="relative" ref={adminMenuRef}>
                <button 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                >
                  Admin
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {adminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                    <div 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        navigate("/admin-panel");
                        setAdminMenuOpen(false);
                      }}
                    >
                      Panel Administracyjny
                    </div>
                    <div 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        navigate("/admin-supabase-config");
                        setAdminMenuOpen(false);
                      }}
                    >
                      Konfiguracja Supabase
                    </div>
                    <div 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        navigate("/admin-data-import");
                        setAdminMenuOpen(false);
                      }}
                    >
                      Import danych
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  {user?.user_metadata?.full_name || user?.email || 'Użytkownik'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                    <div 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        navigate("/client-portal");
                        setUserMenuOpen(false);
                      }}
                    >
                      Portal Klienta
                    </div>
                    <div 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                    >
                      Wyloguj się
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => navigate("/login")} 
                className="text-gray-800 hover:text-gray-600 font-medium"
              >
                Logowanie
              </button>
            )}
          </div>
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {/* Mobile menu icon - simple hamburger */}
            <div className="w-6 h-0.5 bg-current mb-1"></div>
            <div className="w-6 h-0.5 bg-current mb-1"></div>
            <div className="w-6 h-0.5 bg-current"></div>
          </button>
        </div>
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-2 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <span 
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-600 hover:text-primary transition-colors cursor-pointer"
              >
                Strona Główna
              </span>
              <span 
                onClick={() => {
                  navigate("/product-search");
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-600 hover:text-primary transition-colors cursor-pointer"
              >
                Wyszukiwarka CPR
              </span>
              <span 
                onClick={() => {
                  navigate("/documents");
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-600 hover:text-primary transition-colors cursor-pointer"
              >
                Dokumenty
              </span>
              <span 
                onClick={() => {
                  navigate("/services");
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-600 hover:text-primary transition-colors cursor-pointer"
              >
                Usługi
              </span>
              <span 
                onClick={() => {
                  navigate("/Blog");
                  setMobileMenuOpen(false);
                }} 
                className="text-gray-600 hover:text-primary transition-colors cursor-pointer"
              >
                Blog
              </span>
              {/* Admin section in mobile menu - only visible to admin users */}
              {isAuthenticated && user?.email?.endsWith('@multicert.pl') && (
                <div className="pt-2 mt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Admin</p>
                  <span 
                    onClick={() => {
                      navigate("/admin-panel");
                      setMobileMenuOpen(false);
                    }} 
                    className="block py-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                  >
                    Panel Administracyjny
                  </span>
                  <span 
                    onClick={() => {
                      navigate("/admin-supabase-config");
                      setMobileMenuOpen(false);
                    }} 
                    className="block py-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                  >
                    Konfiguracja Supabase
                  </span>
                  <span 
                    onClick={() => {
                      navigate("/admin-data-import");
                      setMobileMenuOpen(false);
                    }} 
                    className="block py-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                  >
                    Import danych
                  </span>
                </div>
              )}
              
              {isAuthenticated ? (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Konto</p>
                  <span 
                    onClick={() => {
                      navigate("/client-portal");
                      setMobileMenuOpen(false);
                    }} 
                    className="block py-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                  >
                    Portal Klienta
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="text-gray-800 hover:text-gray-600 font-medium text-left mt-2"
                  >
                    Wyloguj się
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }} 
                  className="text-gray-800 hover:text-gray-600 font-medium text-left mt-4"
                >
                  Logowanie
                </button>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
