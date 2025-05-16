// import { useState, useEffect, useCallback } from 'react';
// import authService from '../services/authService';
// import { User, AuthToken } from '../models/authModel';
// import { AuthResponse, LoginRequest, RegisterRequest } from '../types/authTypes';
// import { ApiResponse } from '../../../shared/error';

// /**
//  * Custom hook for authentication state and operations
//  */
// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   /**
//    * Initialize auth state from localStorage on mount
//    */
//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       const storedToken = localStorage.getItem('token');
      
//       if (storedUser && storedToken) {
//         setUser(JSON.parse(storedUser));
//         setToken(storedToken);
//       }
//     } catch (err) {
//       console.error('Failed to restore auth state', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /**
//    * Login user with email and password
//    */
//   const login = useCallback(async (credentials: LoginRequest) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await authService.login(credentials.email, credentials.password);
//       setUser(response.user);
//       setToken(response.token);
      
//       // Store in localStorage
//       localStorage.setItem('user', JSON.stringify(response.user));
//       localStorage.setItem('token', response.token);
      
//       return response;
//     } catch (err: any) {
//       setError(err.message || 'Login failed');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /**
//    * Register a new user
//    */
//   const register = useCallback(async (data: RegisterRequest) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await authService.register(data);
//       setUser(response.user);
//       setToken(response.token);
      
//       // Store in localStorage
//       localStorage.setItem('user', JSON.stringify(response.user));
//       localStorage.setItem('token', response.token);
      
//       return response;
//     } catch (err: any) {
//       setError(err.message || 'Registration failed');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /**
//    * Logout current user
//    */
//   const logout = useCallback(async () => {
//     setLoading(true);
    
//     try {
//       await authService.logout();
      
//       // Clear state and storage
//       setUser(null);
//       setToken(null);
//       localStorage.removeItem('user');
//       localStorage.removeItem('token');
//     } catch (err: any) {
//       setError(err.message || 'Logout failed');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return {
//     user,
//     token,
//     loading,
//     error,
//     isAuthenticated: !!user && !!token,
//     login,
//     register,
//     logout
//   };
// };

// export default useAuth;
