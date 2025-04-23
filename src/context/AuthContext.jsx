import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isLoaded: authLoaded, isSignedIn, signOut } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When both auth and user states are loaded, set loading to false
    if (authLoaded && userLoaded) {
      console.log("Auth state loaded, isSignedIn:", isSignedIn);
      setLoading(false);
    }
  }, [authLoaded, userLoaded, isSignedIn]);

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Values to provide through the context
  const value = {
    user,
    isSignedIn: isSignedIn || false, // Ensure it's always a boolean
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};