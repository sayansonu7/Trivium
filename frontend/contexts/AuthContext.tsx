import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, error, isLoading } = useUser();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    async function getAccessToken() {
      if (user) {
        try {
          const response = await fetch('/api/auth/token');
          const data = await response.json();
          setAccessToken(data.accessToken);
        } catch (error) {
          console.error('Failed to get access token:', error);
        }
      }
    }
    
    getAccessToken();
  }, [user]);

  const login = () => window.location.href = '/api/auth/login';
  const logout = () => window.location.href = '/api/auth/logout';

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      accessToken,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};