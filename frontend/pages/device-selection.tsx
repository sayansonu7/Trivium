import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DeviceSelectionModal from "../components/DeviceSelectionModal";
import { apiClient } from "../lib/api";

interface DeviceLimitData {
  current_sessions?: any[];
  max_devices?: number;
}

export default function DeviceSelectionPage() {
  const router = useRouter();
  const [deviceLimitData, setDeviceLimitData] =
    useState<DeviceLimitData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get device limit data from cookies
    const cookies = document.cookie.split(";");
    const deviceLimitCookie = cookies.find((c) =>
      c.trim().startsWith("device_limit_data=")
    );

    if (deviceLimitCookie) {
      try {
        const data = JSON.parse(
          decodeURIComponent(deviceLimitCookie.split("=")[1])
        );
        setDeviceLimitData(data);
      } catch (error) {
        console.error("Failed to parse device limit data:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleForceLogin = async (sessionId: string) => {
    setLoading(true);
    try {
      await apiClient.forceCreateSession(sessionId);

      // Clear cookies
      document.cookie =
        "pending_login=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie =
        "device_limit_data=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      router.push("/dashboard");
    } catch (error) {
      console.error("Force login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Clear cookies and logout
    document.cookie =
      "pending_login=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "device_limit_data=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    window.location.href = "/api/auth/logout";
  };

  if (!deviceLimitData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <DeviceSelectionModal
        isOpen={true}
        sessions={deviceLimitData.current_sessions || []}
        maxDevices={deviceLimitData.max_devices || 3}
        onForceLogin={handleForceLogin}
        onCancel={handleCancel}
      />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-center">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}
