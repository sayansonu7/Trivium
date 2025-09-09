import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { simpleApiClient } from '../lib/simple-api';

interface DeviceLimitState {
  isExceeded: boolean;
  sessions: any[];
  maxDevices: number;
}

export function useSimpleSession() {
  const { user, isLoading } = useUser();
  const [deviceLimitState, setDeviceLimitState] = useState<DeviceLimitState>({ 
    isExceeded: false, 
    sessions: [], 
    maxDevices: 0 
  });
  const [sessionCreated, setSessionCreated] = useState(false);

  const createSession = useCallback(async () => {
    if (!user || sessionCreated) return;
    
    try {
      console.log('Creating session for user:', user.sub);
      const response = await simpleApiClient.createSession(user);
      
      if (response.status === 'device_limit_exceeded') {
        console.log('Device limit exceeded, showing modal');
        setDeviceLimitState({
          isExceeded: true,
          sessions: response.current_sessions || [],
          maxDevices: response.max_devices || 3
        });
        return;
      }
      
      if (response.status === 'success') {
        console.log('Session created successfully');
        setSessionCreated(true);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }, [user, sessionCreated]);

  const forceCreateSession = useCallback(async (sessionId: string) => {
    if (!user) return;
    
    try {
      console.log('Force creating session, terminating:', sessionId);
      await simpleApiClient.forceCreateSession(sessionId, user);
      setDeviceLimitState({ isExceeded: false, sessions: [], maxDevices: 0 });
      setSessionCreated(true);
    } catch (error) {
      console.error('Failed to force create session:', error);
    }
  }, [user]);

  const cancelDeviceSelection = useCallback(() => {
    setDeviceLimitState({ isExceeded: false, sessions: [], maxDevices: 0 });
    window.location.href = '/api/auth/logout';
  }, []);

  // Auto-create session on auth - but only once
  useEffect(() => {
    if (user && !isLoading && !sessionCreated) {
      createSession();
    }
  }, [user, isLoading, sessionCreated, createSession]);

  return {
    deviceLimitState,
    forceCreateSession,
    cancelDeviceSelection,
  };
}