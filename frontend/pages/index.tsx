import { useUser } from "@auth0/nextjs-auth0/client";
import Layout from "../components/Layout";

export default function Home() {
  const { user } = useUser();

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Welcome to Trivium
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Smart 3-device authentication limit with intelligent session
              management. When a 4th login is attempted, users control the
              outcome: terminate an existing session or block the new access.
              Enterprise-grade Auth0 security.
            </p>
          </div>

          {user ? (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
              <div className="flex items-center justify-center mb-6">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg mr-4"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user.name}!
                  </h2>
                  <p className="py-2 text-start text-gray-600 dark:text-gray-300">
                    Check the Profile for Authentication Status
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
            </div>
          ) : (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Get Started Today
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Experience secure authentication with advanced device
                  management
                </p>
              </div>

              <a
                href="/api/auth/login"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Sign In Securely
              </a>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Secure Authentication
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Enterprise-grade Auth0 integration
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-purple-600 dark:text-purple-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Multi-Device Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage sessions across devices
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-indigo-600 dark:text-indigo-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Real-time Control
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Instant session management
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
