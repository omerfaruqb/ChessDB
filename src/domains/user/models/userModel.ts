/**
 * User model
 */
export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User profile model
 */
export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  bio?: string;
  country?: string;
  city?: string;
  dateOfBirth?: Date;
  avatarUrl?: string;
  socialMedia?: SocialMediaLinks;
  chessIds?: ChessIdentifiers;
  achievements?: Achievement[];
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
  ORGANIZER = 'organizer',
  COACH = 'coach'
}

/**
 * Social media links interface
 */
export interface SocialMediaLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitch?: string;
  linkedin?: string;
  discord?: string;
}

/**
 * Chess identifiers interface
 */
export interface ChessIdentifiers {
  fideId?: string;
  uscfId?: string;
  lichessUsername?: string;
  chesscomUsername?: string;
  nationalId?: string;
}

/**
 * Achievement interface
 */
export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date: Date;
  iconUrl?: string;
}
