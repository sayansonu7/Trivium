import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function Home() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner w-12 h-12"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Animated background particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
        {/* Hero Section */}
        <div className="text-center max-w-6xl mx-auto px-6 relative z-10">
          {/* Main Title */}
          <div className="mb-12 animate-fade-in-down">
            <h1 className="text-7xl md:text-8xl font-bold gradient-text-custom mb-8 text-shadow-glow floating">
              Welcome to Trivium
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-primary-400 to-secondary-500 mx-auto rounded-full mb-8 glow-cyan"></div>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed animate-fade-in-up max-w-4xl mx-auto">
              Smart 3-device authentication limit with intelligent session
              management. When a 4th login is attempted, users control the
              outcome: terminate an existing session or block the new access.
              <span className="gradient-text font-semibold">
                {" "}
                Enterprise-grade Auth0 security.
              </span>
            </p>
          </div>

          {user ? (
            /* Authenticated User Section */
            <div className="card-glow animate-bounce-in max-w-2xl mx-auto">
              <div className="flex items-center space-x-6 mb-8">
                {user.picture && (
                  <div className="relative animate-fade-in-left flex-shrink-0">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-primary-400 shadow-glow-lg hover-glow-cyan"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-dark-900 animate-pulse"></div>
                  </div>
                )}
                <div className="flex-1 animate-fade-in-right">
                  <h2 className="text-3xl text-start font-bold gradient-text mb-2">
                    Welcome back, {user.name}!
                  </h2>
                  <p className="text-gray-400 text-lg text-start">
                    Check Profile for more info!
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 flex justify-center">
                <a href="/simple-profile" className="btn-primary group">
                  <span className="flex items-center justify-center">
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
                    View Profile
                  </span>
                </a>
              </div>
            </div>
          ) : (
            /* Login Section */
            <div className="card-glow animate-bounce-in max-w-2xl mx-auto">
              <div className="mb-10">
                <h2 className="text-4xl font-bold gradient-text mb-6">
                  Get Started Today
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Experience secure authentication with advanced device
                  management and real-time session control.
                </p>
              </div>

              <a
                href="/api/auth/login"
                className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-4 px-16 rounded-xl text-xl hover:from-primary-400 hover:to-secondary-400 transition-all duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl mb-12 group"
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform"
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
                  Sign In Securely
                </span>
              </a>
            </div>
          )}

          {/* Stats Section */}
          <div
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">3</div>
              <div className="text-gray-400">Device Limit</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-gray-400">Security</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
