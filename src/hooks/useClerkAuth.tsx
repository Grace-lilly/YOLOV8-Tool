import { createContext, useContext, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuthHook } from '@clerk/clerk-react';

interface AuthContextType {
  user: any;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, isLoaded } = useUser();
  const { isSignedIn, signOut } = useClerkAuthHook();

  const value = {
    user,
    isSignedIn: !!isSignedIn,
    signOut,
    loading: !isLoaded,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};