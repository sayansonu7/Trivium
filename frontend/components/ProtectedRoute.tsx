import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  fallback 
}: ProtectedRouteProps) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && !error) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, error, router]);

  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600">
            Authentication Error
          </h1>
          <p className="text-gray-600 mt-2">{error.message}</p>
          <button 
            onClick={() => router.push('/api/auth/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

// HOC version for page-level protection
export const withAuth = (Component: React.ComponentType) => {
  return withPageAuthRequired(Component);
};