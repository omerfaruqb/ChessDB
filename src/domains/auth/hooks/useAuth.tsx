'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType } from '@/domains/user/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored token on initial load
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Decode token to get user info (in a real app, validate the token with the server)
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.username && payload.userType) {
          setUser({
            username: payload.username,
            userType: payload.userType as UserType,
            // These fields aren't in the token, but required by the User interface
            // In a real app, you'd fetch the full user profile
            password: '',
            name: '',
            surname: '',
            nationality: ''
          });
        }
      } catch (e) {
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);

      // Decode token to get user info
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setUser({
        username: payload.username,
        userType: payload.userType as UserType,
        // These fields aren't in the token, but required by the User interface
        password: '',
        name: '',
        surname: '',
        nationality: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 