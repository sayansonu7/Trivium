import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { simpleApiClient } from "../lib/simple-api";

export default function SimpleProfilePage() {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      try {
        const profile = await simpleApiClient.getCurrentUser(user);
        setUserProfile(profile);
        setFormData({
          full_name: profile.full_name || user.name || "",
          phone_number: profile.phone_number || "",
        });
      } catch (error) {
        console.error("Failed to load user profile:", error);

        setFormData({
          full_name: user.name || "",
          phone_number: "",
        });
      }
    };

    loadUserProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setMessage("");

    if (
      formData.phone_number &&
      formData.phone_number.replace(/\D/g, "").length !== 10
    ) {
      setMessage("Phone number must contain exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const updatedProfile = await simpleApiClient.updateUser(formData, user);
      setUserProfile(updatedProfile);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setMessage(
        `Error updating profile: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto p-6 animate-fade-in-up">
          {/* Profile Header */}
          <div className="card-glow mb-8 overflow-hidden">
            <div className="gradient-cyan p-8 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 relative z-10">
                {user?.picture && (
                  <div className="relative animate-bounce-in">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-2xl hover-glow-cyan"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="text-center md:text-left text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 text-shadow animate-fade-in-right">
                    {formData.full_name || "User Profile"}
                  </h1>
                  <p
                    className="text-xl text-white/80 mb-4 animate-fade-in-right"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {user?.email}
                  </p>
                  <div
                    className="flex flex-wrap justify-center md:justify-start gap-3 animate-fade-in-right"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <span className="glass px-4 py-2 rounded-full text-sm font-medium">
                      🔐 Authenticated
                    </span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        user?.email_verified
                          ? "bg-green-500/20 text-green-100 border border-green-400/30"
                          : "bg-red-500/20 text-red-100 border border-red-400/30"
                      }`}
                    >
                      {user?.email_verified ? "✅ Verified" : "❌ Unverified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`card mb-8 animate-fade-in-down ${
                message.includes("success")
                  ? "border-green-400/30 bg-green-500/10"
                  : "border-red-400/30 bg-red-500/10"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.includes("success") ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {message.includes("success") ? (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <p
                  className={
                    message.includes("success")
                      ? "text-green-300"
                      : "text-red-300"
                  }
                >
                  {message}
                </p>
              </div>
            </div>
          )}

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="card-glow animate-fade-in-left">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold gradient-text">
                  Personal Information
                </h2>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          full_name: e.target.value,
                        })
                      }
                      className="input-modern w-full"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="glass rounded-xl px-4 py-3 group-hover:bg-white/10 transition-all">
                      <p className="text-white font-medium">
                        {formData.full_name || "Not provided"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone_number: e.target.value,
                        })
                      }
                      className="input-modern w-full"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="glass rounded-xl px-4 py-3 group-hover:bg-white/10 transition-all">
                      <p className="text-white font-medium">
                        {formData.phone_number || "Not provided"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <div className="glass rounded-xl px-4 py-3 group-hover:bg-white/10 transition-all">
                    <p className="text-white font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="card-glow animate-fade-in-right">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-secondary-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-secondary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold gradient-text">
                  Account Details
                </h2>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Verification
                  </label>
                  <div className="glass rounded-xl px-4 py-3 group-hover:bg-white/10 transition-all">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          user?.email_verified
                            ? "bg-green-500 animate-pulse"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span className="text-white font-medium">
                        {user?.email_verified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    User ID
                  </label>
                  <div className="glass rounded-xl px-4 py-3 group-hover:bg-white/10 transition-all">
                    <p className="text-white font-mono text-sm break-all">
                      {user?.sub}
                    </p>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Updated
                  </label>
                  <div className="glass rounded-xl px-4 py-3 group-hover:bg-white/10 transition-all">
                    <p className="text-white font-medium">
                      {user?.updated_at
                        ? new Date(user.updated_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="mt-12 flex justify-center animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary group min-w-[140px]"
                  >
                    <span className="flex items-center justify-center">
                      {loading ? (
                        <>
                          <div className="spinner w-5 h-5 mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"
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
                          Save Changes
                        </>
                      )}
                    </span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary group"
                  >
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Cancel
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary group"
                >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
