import { ExpertiseLevel, RatingType, ChessTitle } from '../models/expertiseModel';

/**
 * Response type for expertise operations
 */
export interface ExpertiseResponse {
  data: ExpertiseLevel | ExpertiseLevel[];
  success: boolean;
  message?: string;
}

/**
 * Request payload for creating expertise
 */
export interface CreateExpertiseRequest {
  userId: string;
  ratingType: RatingType;
  ratingValue: number;
  title?: ChessTitle;
  achievedDate?: Date;
}

/**
 * Request payload for updating expertise
 */
export interface UpdateExpertiseRequest {
  ratingType?: RatingType;
  ratingValue?: number;
  title?: ChessTitle;
}
