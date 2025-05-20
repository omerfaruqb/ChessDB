'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Player, Coach, Arbiter, Manager, UserType } from '@/domains/user/types';

// Define a type that encompasses all possible user types
type AuthUser = (User | Player | Coach | Arbiter | Manager) & { userType: UserType };

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => false,
  logout: () => {},
});

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('Checking auth status...');
      try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        console.log('Auth status response:', data);

        if (data.isAuthenticated && data.user) {
          console.log('User is authenticated:', data.user);
          setUser(data.user as AuthUser);
        } else {
          console.log('User is not authenticated');
        }
      } catch (err) {
        console.error('Auth status check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Logging in user:', username);
      setLoading(true);
      setError(null);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log('Login response:', data);

      if (data.success) {
        console.log('Login successful for user:', data.user);
        setUser(data.user as AuthUser);
        return true;
      } else {
        console.log('Login failed:', data.message);
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out user');
      setLoading(true);
      
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      setUser(null);
      console.log('User logged out');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  console.log('Auth provider state:', { user, loading, error });

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
