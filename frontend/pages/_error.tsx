import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [router]);

  const getErrorMessage = () => {
    switch (statusCode) {
      case 404:
        return "The page you're looking for doesn't exist";
      case 500:
        return "Internal server error occurred";
      case 403:
        return "You don't have permission to access this resource";
      case 401:
        return "Authentication required";
      default:
        return statusCode
          ? `A ${statusCode} error occurred on server`
          : "An error occurred on client";
    }
  };

  const getErrorIcon = () => {
    switch (statusCode) {
      case 404:
        return (
          <svg
            className="w-24 h-24 text-primary-400 mx-auto mb-8 animate-bounce-in"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.7-2.6L3 15l3.3-2.6C7.71 10.99 9.66 10 12 10s4.29.99 5.7 2.4L21 15l-3.3-2.6z"
            />
          </svg>
        );
      case 500:
        return (
          <svg
            className="w-24 h-24 text-red-400 mx-auto mb-8 animate-bounce-in"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-24 h-24 text-primary-400 mx-auto mb-8 animate-bounce-in"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
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

      <div className="text-center max-w-2xl mx-auto px-6 relative z-10">
        <div className="card-glow animate-fade-in-up">
          {/* Error Icon */}
          {getErrorIcon()}

          {/* Error Code */}
          <div className="text-8xl font-bold gradient-text mb-6 animate-fade-in-down">
            {statusCode || "???"}
          </div>

          {/* Error Title */}
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Oops! Something went wrong
          </h1>

          {/* Error Message */}
          <p
            className="text-xl text-gray-300 mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            {getErrorMessage()}
          </p>

          {/* Countdown */}
          <div
            className="mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="inline-flex items-center space-x-3 glass rounded-2xl px-6 py-4">
              <div className="spinner w-6 h-6"></div>
              <span className="text-gray-300">
                Redirecting to homepage in{" "}
                <span className="text-primary-400 font-bold text-xl">
                  {countdown}
                </span>{" "}
                seconds
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <button
              onClick={() => router.push("/")}
              className="btn-primary group"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go to Homepage
              </span>
            </button>

            <button
              onClick={() => router.back()}
              className="btn-secondary group"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Go Back
              </span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="btn-ghost group"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Retry
              </span>
            </button>
          </div>

          {/* Additional Info */}
          <div
            className="mt-12 pt-8 border-t border-primary-500/20 animate-fade-in-up"
            style={{ animationDelay: "1s" }}
          >
            <p className="text-gray-400 text-sm mb-4">
              If this problem persists, please contact our support team.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a
                href="#"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Support Center
              </a>
              <a
                href="#"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Status Page
              </a>
              <a
                href="#"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary-500/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
