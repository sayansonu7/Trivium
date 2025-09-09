import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { apiClient } from "../lib/api";

interface UserProfile {
  full_name?: string;
  phone_number?: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
        const profile = await apiClient.getCurrentUser();
        setUserProfile(profile);
        setFormData({
          full_name: profile.full_name || "",
          phone_number: profile.phone_number || "",
        });
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const updatedProfile = await apiClient.updateUser(formData);
      setUserProfile(updatedProfile);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setMessage(
        `Error updating profile: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
              <div className="flex items-center space-x-6">
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                )}
                <div className="text-white">
                  <h1 className="text-3xl font-bold">
                    {user?.name || "User Profile"}
                  </h1>
                  <p className="text-blue-100 mt-2">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Personal Information
                  </h2>

                  {message && (
                    <div
                      className={`p-3 rounded ${
                        message.includes("success")
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
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
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {userProfile?.full_name || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
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
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {userProfile?.phone_number || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <p className="text-gray-900 font-medium">{user?.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Email Verified
                      </label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user?.email_verified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user?.email_verified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Account Details
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        User ID
                      </label>
                      <p className="text-gray-900 font-mono text-sm">
                        {user?.sub}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Last Updated
                      </label>
                      <p className="text-gray-900">
                        {user?.updated_at
                          ? new Date(user.updated_at).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Profile Management
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Manage your account settings and preferences
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
