import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useClerkAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-background">
        <div className="text-center space-y-4">
          <div className="animate-pulse-soft">
            <div className="h-12 w-12 bg-guide-primary rounded-full mx-auto animate-float"></div>
          </div>
          <p className="text-muted-foreground" aria-live="polite">
            Loading VisionGuide AI...
          </p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};