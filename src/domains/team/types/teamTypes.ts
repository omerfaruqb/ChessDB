import { Team, TeamMember, TeamRole, SocialMediaLinks } from '../models/teamModel';

/**
 * Response type for team operations
 */
export interface TeamResponse {
  data: Team | Team[];
  success: boolean;
  message?: string;
}

/**
 * Response type for team member operations
 */
export interface TeamMemberResponse {
  data: TeamMember | TeamMember[];
  success: boolean;
  message?: string;
}

/**
 * Request payload for creating a team
 */
export interface CreateTeamRequest {
  name: string;
  logoUrl?: string;
  country?: string;
  city?: string;
  description?: string;
  captain?: string;
  founded?: Date;
  website?: string;
  socialMedia?: SocialMediaLinks;
}

/**
 * Request payload for updating a team
 */
export interface UpdateTeamRequest {
  name?: string;
  logoUrl?: string;
  country?: string;
  city?: string;
  description?: string;
  captain?: string;
  founded?: Date;
  website?: string;
  socialMedia?: Partial<SocialMediaLinks>;
}

/**
 * Request payload for adding a team member
 */
export interface AddTeamMemberRequest {
  playerId: string;
  role: TeamRole;
  boardPosition?: number;
  joinDate?: Date;
}

/**
 * Request payload for updating a team member
 */
export interface UpdateTeamMemberRequest {
  role?: TeamRole;
  boardPosition?: number;
  isActive?: boolean;
}
