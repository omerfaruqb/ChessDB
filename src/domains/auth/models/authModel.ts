/**
 * User model for authentication
 */
export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User roles enum
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

/**
 * Authentication token model
 */
export interface AuthToken {
  token: string;
  expiresAt: Date;
}
