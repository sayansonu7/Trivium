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
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceIcon = (deviceInfo: DeviceInfo) => {
    const deviceType = deviceInfo.device_type?.toLowerCase() || "";
    const os = deviceInfo.operating_system?.toLowerCase() || "";

    if (
      deviceType.includes("mobile") ||
      os.includes("android") ||
      os.includes("ios")
    ) {
      return (
        <svg
          className="w-6 h-6 text-primary-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (deviceType.includes("tablet")) {
      return (
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
            d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    } else {
      return (
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
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="glass-strong rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl animate-bounce-in border border-primary-500/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-cyan">
            <svg
              className="w-8 h-8 text-white"
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
          <h2 className="text-3xl font-bold gradient-text-custom mb-3">
            Device Limit Reached
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            You have reached the maximum of{" "}
            <span className="text-primary-400 font-semibold">{maxDevices}</span>{" "}
            active devices. Please select a device to log out and continue with
            this device.
          </p>
        </div>

        {/* Device List */}
        <div className="space-y-4 mb-8 max-h-80 overflow-y-auto scrollbar-thin">
          {sessions.map((session, index) => (
            <div
              key={session.session_id}
              className={`bg-dark-800/90 backdrop-blur-xl border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-fade-in-up ${
                selectedSessionId === session.session_id
                  ? "border-2 border-primary-400 glow-cyan bg-primary-500/20"
                  : "border-white/30 hover:border-primary-400/70 hover:bg-dark-700/80"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedSessionId(session.session_id)}
            >
              <div className="flex items-start space-x-4">
                {/* Custom Radio Button */}
                <div className="relative mt-1">
                  <input
                    type="radio"
                    name="session"
                    value={session.session_id}
                    checked={selectedSessionId === session.session_id}
                    onChange={() => setSelectedSessionId(session.session_id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      selectedSessionId === session.session_id
                        ? "border-primary-400 bg-primary-400"
                        : "border-gray-300 hover:border-primary-400"
                    }`}
                  >
                    {selectedSessionId === session.session_id && (
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                </div>

                {/* Device Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-primary-500/40 rounded-xl flex items-center justify-center">
                  {getDeviceIcon(session.device_info)}
                </div>

                {/* Device Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    {formatDeviceInfo(session.device_info)}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-300">
                      <svg
                        className="w-4 h-4 mr-2 text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="font-mono">{session.ip_address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <svg
                        className="w-4 h-4 mr-2 text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Last Activity:{" "}
                        {formatLastActivity(session.last_activity)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedSessionId === session.session_id && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center animate-pulse">
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={onCancel}
            className="btn-secondary group order-2 sm:order-1"
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
              Cancel Login
            </span>
          </button>
          <button
            onClick={() => onForceLogin(selectedSessionId)}
            disabled={!selectedSessionId}
            className="bg-gradient-to-r from-indigo-500 to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 group order-1 sm:order-2"
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Force Login
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
