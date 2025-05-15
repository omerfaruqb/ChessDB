/**
 * Team model
 */
export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  country?: string;
  city?: string;
  description?: string;
  captain?: string; // User ID of team captain
  founded?: Date;
  website?: string;
  socialMedia?: SocialMediaLinks;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Team member model
 */
export interface TeamMember {
  id: string;
  teamId: string;
  playerId: string;
  role: TeamRole;
  boardPosition?: number; // Position in team lineup (1 = first board, etc.)
  joinDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Team roles enum
 */
export enum TeamRole {
  CAPTAIN = 'captain',
  COACH = 'coach',
  PLAYER = 'player',
  RESERVE = 'reserve',
  MANAGER = 'manager'
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
  discord?: string;
}
