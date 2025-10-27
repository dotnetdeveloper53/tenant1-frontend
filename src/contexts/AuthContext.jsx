import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, tokenManager } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token
        if (tokenManager.isAuthenticated()) {
          // Try to get current user to verify token is still valid
          const response = await authApi.getCurrentUser();
          if (response.data.success) {
            setUser(response.data.data);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            tokenManager.clearTokens();
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        // Token is invalid or expired, clear it
        tokenManager.clearTokens();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authApi.login(username, password);
      if (response.success) {
        // Get user profile after successful login
        const userResponse = await authApi.getCurrentUser();
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
          setIsAuthenticated(true);
          return { success: true };
        }
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};