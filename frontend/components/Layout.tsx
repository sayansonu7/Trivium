import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { ReactNode } from "react";
import LoginButton from "./LoginButton";
import { useSessionValidator } from "../hooks/useSessionValidator";
import LogoutModal from "./LogoutModal";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isLoading } = useUser();
  const { isSessionValid, logoutMessage, handleLogout } = useSessionValidator();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-700 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border-b border-white/20 dark:border-slate-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                Trivium
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/simple-profile"
                        className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                      >
                        Profile
                      </Link>

                      <a
                        href="/api/auth/logout"
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                      >
                        Logout
                      </a>
                    </>
                  ) : (
                    <LoginButton />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <LogoutModal
        isOpen={!isSessionValid}
        message={logoutMessage}
        onLogout={handleLogout}
      />
    </div>
  );
}
