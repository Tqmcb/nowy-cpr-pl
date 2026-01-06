import React from 'react';
import { AuthProvider } from '../utils/AuthContext';

interface AuthWrapperProps {
  children: React.ReactNode;
}

/**
 * AuthWrapper provides the unified authentication context to its children
 * Use this component to wrap pages that need authentication
 * Note: The Toaster component is already included at the application level
 */
export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
