import { User } from '../models/authModel';

/**
 * Authentication response returned after login/registration
 */
export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
