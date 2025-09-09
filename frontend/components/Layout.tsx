import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import LoginButton from "./LoginButton";
import { useSessionValidator } from "../hooks/useSessionValidator";
import LogoutModal from "./LogoutModal";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isLoading } = useUser();
  const { isSessionValid, logoutMessage, handleLogout } = useSessionValidator();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="spinner w-20 h-20 mx-auto mb-6"></div>
          <div className="text-2xl font-bold gradient-text mb-4">
            Loading Trivium
          </div>
          <p className="text-gray-400 text-lg">
            Preparing your secure experience...
          </p>

          {/* Loading dots animation */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation Header */}
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-strong shadow-2xl border-b border-primary-500/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center animate-slide-in-left">
              <Link
                href="/"
                className="text-3xl font-bold text-primary-400 hover:text-primary-300 transition-all duration-300 group"
              >
                <span className="group-hover:scale-105 inline-block transition-transform">
                  Trivium
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 animate-slide-in-right">
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      {/* User Avatar */}
                      <div className="flex items-center space-x-4">
                        {user.picture && (
                          <img
                            src={user.picture}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-primary-400 hover-glow-cyan transition-all duration-300"
                          />
                        )}
                        <span className="text-gray-300 font-medium">
                          {user.name}
                        </span>
                      </div>

                      {/* Navigation Links */}
                      <Link href="/simple-profile" className="btn-ghost group">
                        <span className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile
                        </span>
                      </Link>

                      {/* Logout Button */}
                      <a
                        href="/api/auth/logout"
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium hover:-translate-y-1 group"
                      >
                        <span className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </span>
                      </a>
                    </>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <LoginButton />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-primary-400 transition-colors p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-strong border-t border-primary-500/20 animate-fade-in-down">
            <div className="px-4 py-6 space-y-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 pb-4 border-b border-primary-500/20">
                    {user.picture && (
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-primary-400"
                      />
                    )}
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>

                  <Link
                    href="/simple-profile"
                    className="block btn-ghost text-left"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <a
                    href="/api/auth/logout"
                    className="block w-full text-left bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium"
                  >
                    Logout
                  </a>
                </>
              ) : (
                <div className="space-y-4">
                  <LoginButton />
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20">{children}</main>

      {/* Footer */}
      <footer className="glass border-t border-primary-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
            {/* Brand Section */}
            <div className="flex-1 max-w-md">
              <div className="text-3xl font-bold text-primary-400 mb-4">
                Trivium
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Advanced authentication platform with intelligent session
                management and enterprise-grade security.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a
                href="mailto:sayan.professional7@gmail.com"
                className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center hover-glow-cyan cursor-pointer transition-all duration-300 hover:scale-110"
                title="Email"
              >
                <svg
                  className="w-6 h-6 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
              <a
                href="https://github.com/sayansonu7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center hover-glow-cyan cursor-pointer transition-all duration-300 hover:scale-110"
                title="GitHub"
              >
                <svg
                  className="w-6 h-6 text-primary-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/sayanpalofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center hover-glow-cyan cursor-pointer transition-all duration-300 hover:scale-110"
                title="LinkedIn"
              >
                <svg
                  className="w-6 h-6 text-primary-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-primary-500/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Trivium x sayansonu7. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-300"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-300"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-300"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Session Modal */}
      <LogoutModal
        isOpen={!isSessionValid}
        message={logoutMessage}
        onLogout={handleLogout}
      />
    </div>
  );
}
