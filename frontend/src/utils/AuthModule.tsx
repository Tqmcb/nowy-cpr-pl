import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { signUp, signIn, signOut, resetPassword, updatePassword, getCurrentUser, getSession, getUserProfile, updateUserProfile, getAuthErrorMessage } from './authHelpers';

// This is a utility component that can be used to wrap any page that needs auth
export const withAuth = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
  const WithAuth: React.FC<P> = (props) => {
    return (
      <AuthProvider>
        <Component {...props} />
      </AuthProvider>
    );
  };
  
  return WithAuth;
};

// This is a utility component that can be used to wrap any protected page
export const withProtectedAuth = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/login'
): React.FC<P> => {
  const WithProtectedAuth: React.FC<P> = (props) => {
    return (
      <AuthProvider>
        <ProtectedRoute redirectTo={redirectTo}>
          <Component {...props} />
        </ProtectedRoute>
      </AuthProvider>
    );
  };
  
  return WithProtectedAuth;
};

// Export all auth-related utilities
export * from './AuthContext';
export * from './authHelpers';
