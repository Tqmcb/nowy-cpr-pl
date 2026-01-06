import React from 'react';
import { AuthProvider } from './AuthContextUnified';

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

/**
 * withAuth is a higher-order component that wraps a component with the AuthWrapper
 */
export const withAuth = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
  const WithAuth: React.FC<P> = (props) => {
    return (
      <AuthWrapper>
        <Component {...props} />
      </AuthWrapper>
    );
  };
  
  return WithAuth;
};

/**
 * withProtectedAuth is a higher-order component that wraps a component with the AuthWrapper and ProtectedRoute
 */
export const withProtectedAuth = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/login'
): React.FC<P> => {
  // Import ProtectedRoute inside the function to avoid circular dependency
  const { ProtectedRoute } = require('../components/ProtectedRoute');
  
  const WithProtectedAuth: React.FC<P> = (props) => {
    return (
      <AuthWrapper>
        <ProtectedRoute redirectTo={redirectTo}>
          <Component {...props} />
        </ProtectedRoute>
      </AuthWrapper>
    );
  };
  
  return WithProtectedAuth;
};
