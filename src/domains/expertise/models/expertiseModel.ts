/**
 * Chess expertise/rating model
 */
export interface ExpertiseLevel {
  id: string;
  userId: string;
  ratingType: RatingType;
  ratingValue: number;
  title?: ChessTitle;
  achievedDate: Date;
  updatedAt: Date;
}

/**
 * Types of chess ratings
 */
export enum RatingType {
  FIDE = 'fide',
  USCF = 'uscf',
  LICHESS = 'lichess',
  CHESS_COM = 'chess.com',
  NATIONAL = 'national',
}

/**
 * Chess titles
 */
export enum ChessTitle {
  GM = 'Grandmaster',
  IM = 'International Master',
  FM = 'FIDE Master',
  CM = 'Candidate Master',
  WGM = 'Woman Grandmaster',
  WIM = 'Woman International Master',
  WFM = 'Woman FIDE Master',
  WCM = 'Woman Candidate Master',
  NM = 'National Master',
}
