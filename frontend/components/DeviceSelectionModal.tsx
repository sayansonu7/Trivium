import { useState } from "react";

interface DeviceInfo {
  device_type: string;
  browser: string;
  operating_system: string;
}

interface Session {
  session_id: string;
  device_info: DeviceInfo;
  ip_address: string;
  created_at: string;
  last_activity: string;
}

interface DeviceSelectionModalProps {
  isOpen: boolean;
  sessions: Session[];
  maxDevices: number;
  onForceLogin: (sessionId: string) => void;
  onCancel: () => void;
}

export default function DeviceSelectionModal({
  isOpen,
  sessions,
  maxDevices,
  onForceLogin,
  onCancel,
}: DeviceSelectionModalProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");

  if (!isOpen) return null;

  const formatDeviceInfo = (deviceInfo: DeviceInfo) => {
    return `${deviceInfo.browser} on ${deviceInfo.operating_system}`;
  };

  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Device Limit Reached</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You have reached the maximum of {maxDevices} active devices. Please
          select a device to log out and continue with this device.
        </p>

        <div className="space-y-3 mb-6">
          {sessions.map((session) => (
            <div
              key={session.session_id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedSessionId === session.session_id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
              onClick={() => setSelectedSessionId(session.session_id)}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="session"
                  value={session.session_id}
                  checked={selectedSessionId === session.session_id}
                  onChange={() => setSelectedSessionId(session.session_id)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <h3 className="font-medium dark:text-white">
                    {formatDeviceInfo(session.device_info)}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <p>IP: {session.ip_address}</p>
                    <p>
                      Last Activity: {formatLastActivity(session.last_activity)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel Login
          </button>
          <button
            onClick={() => onForceLogin(selectedSessionId)}
            disabled={!selectedSessionId}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Force Login
          </button>
        </div>
      </div>
    </div>
  );
}
