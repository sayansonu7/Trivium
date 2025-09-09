import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useSession } from '../hooks/useSession';

export default function SessionsPage() {
  const { sessions, loading, loadSessions, terminateSession } = useSession();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const formatDeviceInfo = (deviceInfo: any) => {
    return `${deviceInfo.browser} on ${deviceInfo.operating_system} (${deviceInfo.device_type})`;
  };

  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Active Sessions</h1>
          <p className="text-gray-600 mt-2">
            Manage your active login sessions across different devices
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No active sessions found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sessions.map((session) => (
                <div key={session.session_id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {formatDeviceInfo(session.device_info)}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>IP Address: {session.ip_address}</p>
                        <p>Created: {formatLastActivity(session.created_at)}</p>
                        <p>Last Activity: {formatLastActivity(session.last_activity)}</p>
                      </div>
                      {session.is_current && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                          Current Session
                        </span>
                      )}
                    </div>
                    
                    {!session.is_current && (
                      <button
                        onClick={() => terminateSession(session.session_id)}
                        className="ml-4 px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                      >
                        Terminate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}