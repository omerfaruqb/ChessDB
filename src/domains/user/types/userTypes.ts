import { User, UserProfile, UserRole, SocialMediaLinks, ChessIdentifiers, Achievement } from '../models/userModel';

/**
 * Response type for user operations
 */
export interface UserResponse {
  data: User | User[];
  success: boolean;
  message?: string;
}

/**
 * Response type for profile operations
 */
export interface ProfileResponse {
  data: UserProfile;
  success: boolean;
  message?: string;
}

/**
 * Request payload for updating a user
 */
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Request payload for updating a user profile
 */
export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  country?: string;
  city?: string;
  dateOfBirth?: Date;
  avatarUrl?: string;
  socialMedia?: Partial<SocialMediaLinks>;
  chessIds?: Partial<ChessIdentifiers>;
}

/**
 * Request payload for changing password
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Request payload for adding an achievement
 */
export interface AddAchievementRequest {
  title: string;
  description?: string;
  date: Date;
  iconUrl?: string;
}
