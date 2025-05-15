import { Match, MatchResult, TerminationType } from '../models/matchModel';

/**
 * Response type for match operations
 */
export interface MatchResponse {
  data: Match | Match[];
  success: boolean;
  message?: string;
}

/**
 * Request payload for creating a match
 */
export interface CreateMatchRequest {
  tournamentId?: string;
  whitePlayerId: string;
  blackPlayerId: string;
  startTime: Date;
  round?: number;
  boardNumber?: number;
}

/**
 * Request payload for updating a match
 */
export interface UpdateMatchRequest {
  startTime?: Date;
  endTime?: Date;
  pgn?: string;
  round?: number;
  boardNumber?: number;
}

/**
 * Request payload for submitting match result
 */
export interface SubmitResultRequest {
  winner?: string;
  whiteScore: number;
  blackScore: number;
  terminationType: TerminationType;
  moves?: number;
  endTime: Date;
}
