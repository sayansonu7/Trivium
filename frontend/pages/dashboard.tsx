import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useUser } from "@auth0/nextjs-auth0/client";
import { apiClient } from "../lib/api";
import { FiRefreshCw } from "react-icons/fi";

export default function Dashboard() {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      setIsRefreshing(true);
      const profile = await apiClient.getCurrentUser();
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Push current page to history to prevent back to Auth0 error
    window.history.pushState(null, "", "/dashboard");

    loadUserProfile();

    // Refresh profile data every 30 seconds
    const interval = setInterval(loadUserProfile, 100000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    // Handle back button
    const handlePopState = () => {
      router.push("/");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  return (
    <Layout>
      <ProtectedRoute>
        <div className="space-y-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center mb-8">
              {user?.picture && (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg mr-6"
                />
              )}
              <div className="flex items-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome,{" "}
                  {(userProfile as { full_name?: string })?.full_name ||
                    user?.name}
                  !
                </h1>
                <button
                  onClick={loadUserProfile}
                  className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={isRefreshing}
                >
                  <FiRefreshCw
                    className={`w-6 h-6 text-blue-600 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                </button>
                <p className="text-gray-600 text-lg mt-2">
                  Your secure dashboard
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Full Name
                </h3>
                <p className="text-blue-800 text-xl font-medium">
                  {userProfile?.full_name || "Not provided"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Phone Number
                </h3>
                <p className="text-purple-800 text-xl font-medium">
                  {userProfile?.phone_number || "Not provided"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Account Status
                </h3>
                <p className="text-green-700 font-medium">✓ Authenticated</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">Profile</h3>
                <p className="text-blue-700 font-medium">✓ JWT Protected</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
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
                <h3 className="font-semibold text-purple-900 mb-2">Security</h3>
                <p className="text-purple-700 font-medium">✓ Auth0 Active</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
