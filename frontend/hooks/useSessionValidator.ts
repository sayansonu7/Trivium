import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { simpleApiClient } from '../lib/simple-api';

export function useSessionValidator() {
  const { user } = useUser();
  const [isSessionValid, setIsSessionValid] = useState(true);
  const [logoutMessage, setLogoutMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    const validateSession = async () => {
      try {
        const result = await simpleApiClient.validateSession(user);
        
        if (!result.valid) {
          setIsSessionValid(false);
          setLogoutMessage(result.message || 'You have been logged out from another device');
        }
      } catch (error) {
        console.error('Session validation failed:', error);
      }
    };

    // Check session validity every 30 seconds
    const interval = setInterval(validateSession, 30000);
    
    // Initial check
    validateSession();

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return {
    isSessionValid,
    logoutMessage,
    handleLogout
  };
}