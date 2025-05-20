export interface Match {

  match_id: number;

  date: string;

  time_slot: 1 | 2 | 3;

  hall_id: number;
  table_id: number;

  team1_id: number;
  team2_id: number;

  white_player_username: string;
  black_player_username: string;
  match_result: MatchResult;
  arbiter_username: string;
  rating: number | null;
};

export type MatchResult = 'white_wins' | 'black_wins' | 'draw';