/**
 * Tournament model
 */
export interface Tournament {
  id: string;
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
  currentRound?: number;
  organizer: string; // User ID of organizer
  director?: string; // User ID of tournament director
  maxParticipants?: number;
  entryFee?: number;
  currency?: string;
  prizes?: PrizeStructure;
  isTeamEvent: boolean;
  status: TournamentStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tournament registration model
 */
export interface TournamentRegistration {
  id: string;
  tournamentId: string;
  playerId: string;
  teamId?: string;
  seedNumber?: number;
  registrationDate: Date;
  paid: boolean;
  status: RegistrationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tournament types enum
 */
export enum TournamentType {
  OPEN = 'open',
  INVITATIONAL = 'invitational',
  CHAMPIONSHIP = 'championship',
  QUALIFIER = 'qualifier',
  SIMUL = 'simultaneous',
  EXHIBITION = 'exhibition'
}

/**
 * Tournament formats enum
 */
export enum TournamentFormat {
  SWISS = 'swiss',
  ROUND_ROBIN = 'round_robin',
  DOUBLE_ROUND_ROBIN = 'double_round_robin',
  ELIMINATION = 'elimination',
  DOUBLE_ELIMINATION = 'double_elimination',
  ARENA = 'arena',
  SCHEVENINGEN = 'scheveningen'
}

/**
 * Tournament status enum
 */
export enum TournamentStatus {
  UPCOMING = 'upcoming',
  REGISTRATION_OPEN = 'registration_open',
  REGISTRATION_CLOSED = 'registration_closed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Registration status enum
 */
export enum RegistrationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WAITLISTED = 'waitlisted',
  CANCELLED = 'cancelled'
}

/**
 * Prize structure interface
 */
export interface PrizeStructure {
  total?: number;
  first?: number;
  second?: number;
  third?: number;
  other?: Record<string, number>; // e.g., {"Best U1800": 100}
}
