/**
 * Chess match model
 */
export interface Match {
  id: string;
  tournamentId?: string;
  whitePlayerId: string;
  blackPlayerId: string;
  startTime: Date;
  endTime?: Date;
  result?: MatchResult;
  pgn?: string;
  round?: number;
  boardNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Match result model
 */
export interface MatchResult {
  winner?: string; // player ID or 'draw'
  whiteScore: number;
  blackScore: number;
  terminationType: TerminationType;
  moves?: number;
}

/**
 * Types of match termination
 */
export enum TerminationType {
  CHECKMATE = 'checkmate',
  STALEMATE = 'stalemate',
  TIME_FORFEIT = 'time_forfeit',
  RESIGNATION = 'resignation',
  DRAW_AGREEMENT = 'draw_agreement',
  DRAW_REPETITION = 'draw_repetition',
  DRAW_INSUFFICIENT = 'draw_insufficient',
  DRAW_FIFTY_MOVE = 'draw_fifty_move',
  NO_SHOW = 'no_show',
  FORFEIT = 'forfeit',
  ADJUDICATION = 'adjudication',
}
