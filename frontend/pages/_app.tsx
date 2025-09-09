import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SimpleSessionManager from "../components/SimpleSessionManager";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Handle Auth0 errors in URL parameters
    const handleAuth0Errors = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get("error");
      const errorDescription = urlParams.get("error_description");

      if (error) {
        console.log("Auth0 error detected:", error, errorDescription);
        // Clear the error from URL and redirect to homepage
        router.replace("/");
      }
    };

    // Check for errors on initial load
    handleAuth0Errors();

    // Listen for route changes to catch Auth0 errors
    const handleRouteChange = () => {
      handleAuth0Errors();
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return (
    <UserProvider>
      <Component {...pageProps} />
      <SimpleSessionManager />
    </UserProvider>
  );
}
