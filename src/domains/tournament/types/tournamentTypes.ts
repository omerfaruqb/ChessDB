import { 
  Tournament, 
  TournamentRegistration, 
  TournamentType,
  TournamentFormat,
  TournamentStatus,
  RegistrationStatus,
  PrizeStructure
} from '../models/tournamentModel';

/**
 * Response type for tournament operations
 */
export interface TournamentResponse {
  data: Tournament | Tournament[];
  success: boolean;
  message?: string;
}

/**
 * Response type for registration operations
 */
export interface RegistrationResponse {
  data: TournamentRegistration | TournamentRegistration[];
  success: boolean;
  message?: string;
}

/**
 * Request payload for creating a tournament
 */
export interface CreateTournamentRequest {
  name: string;
  description?: string;
  location?: string;
  venueAddress?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  type: TournamentType;
  format: TournamentFormat;
  timeControl?: string;
  rounds?: number;
  organizer: string;
  director?: string;
  maxParticipants?: number;
  entryFee?: number;
  currency?: string;
  prizes?: PrizeStructure;
  isTeamEvent: boolean;
  status?: TournamentStatus;
}

/**
 * Request payload for updating a tournament
 */
export interface UpdateTournamentRequest {
  name?: string;
  description?: string;
  location?: string;
  venueAddress?: string;
  startDate?: Date;
  endDate?: Date;
  registrationDeadline?: Date;
  type?: TournamentType;
  format?: TournamentFormat;
  timeControl?: string;
  rounds?: number;
  currentRound?: number;
  director?: string;
  maxParticipants?: number;
  entryFee?: number;
  currency?: string;
  prizes?: PrizeStructure;
  status?: TournamentStatus;
}

/**
 * Request payload for registering a player
 */
export interface RegisterPlayerRequest {
  playerId: string;
  teamId?: string;
  seedNumber?: number;
  notes?: string;
}

/**
 * Request payload for updating a registration
 */
export interface UpdateRegistrationRequest {
  seedNumber?: number;
  paid?: boolean;
  status?: RegistrationStatus;
  notes?: string;
}
