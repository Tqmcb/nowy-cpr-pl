import React from 'react';
import { Toaster } from 'sonner';

interface AppContainerProps {
  children: React.ReactNode;
}

/**
 * A container component that wraps page content and provides global UI elements like the Toaster
 */
export const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
};
