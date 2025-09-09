import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { apiClient } from '../lib/api';

interface DeviceInfo {
  device_type: string;
  browser: string;
  operating_system: string;
}

interface SessionData {
  session_id: string;
  device_info: DeviceInfo;
  ip_address: string;
  created_at: string;
  last_activity: string;
  is_current: boolean;
}

interface DeviceLimitState {
  isExceeded: boolean;
  sessions: SessionData[];
  maxDevices: number;
}

export function useSession() {
  const { user, isLoading } = useUser();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deviceLimitState, setDeviceLimitState] = useState<DeviceLimitState>({ 
    isExceeded: false, 
    sessions: [], 
    maxDevices: 0 
  });

  const loadSessions = useCallback(async () => {
    if (!user || isLoading) return;
    
    setLoading(true);
    try {
      const sessionsData = await apiClient.getUserSessions();
      setSessions(sessionsData);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isLoading]);

  const createSession = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await apiClient.createSession();
      console.log('Session creation response:', response);
      
      if (response.status === 'device_limit_exceeded') {
        console.log('Device limit exceeded, showing modal');
        setDeviceLimitState({
          isExceeded: true,
          sessions: response.current_sessions || [],
          maxDevices: response.max_devices || 3
        });
        return;
      }
      
      if (response.status === 'success' && response.session_id) {
        setCurrentSessionId(response.session_id);
        await loadSessions();
      } else if (response.session_id) {
        // Handle case where response format is different
        setCurrentSessionId(response.session_id);
        await loadSessions();
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }, [user, loadSessions]);

  const forceCreateSession = useCallback(async (forceSessionId: string) => {
    if (!user) return;
    
    try {
      const response = await apiClient.forceCreateSession(forceSessionId);
      
      if (response.session_id) {
        setCurrentSessionId(response.session_id);
        setDeviceLimitState({ isExceeded: false, sessions: [], maxDevices: 0 });
        await loadSessions();
      }
    } catch (error) {
      console.error('Failed to force create session:', error);
    }
  }, [user, loadSessions]);

  const cancelDeviceSelection = useCallback(() => {
    setDeviceLimitState({ isExceeded: false, sessions: [], maxDevices: 0 });
  }, []);

  const terminateSession = useCallback(async (sessionId: string) => {
    try {
      await apiClient.terminateSession(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  }, [loadSessions]);

  const sendHeartbeat = useCallback(async () => {
    if (!currentSessionId) return;
    
    try {
      await apiClient.sendSessionHeartbeat(currentSessionId);
    } catch (error) {
      console.warn('Session heartbeat failed:', error);
    }
  }, [currentSessionId]);

  // Auto-create session on auth
  useEffect(() => {
    if (user && !isLoading) {
      createSession();
    }
  }, [user, isLoading, createSession]);

  // Session heartbeat every 5 minutes
  useEffect(() => {
    if (!currentSessionId) return;

    const interval = setInterval(sendHeartbeat, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentSessionId, sendHeartbeat]);

  return {
    sessions,
    currentSessionId,
    loading,
    deviceLimitState,
    loadSessions,
    createSession,
    forceCreateSession,
    cancelDeviceSelection,
    terminateSession,
    sendHeartbeat,
  };
}