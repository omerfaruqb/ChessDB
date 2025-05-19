
export interface Match {

  match_id: number;

  date: string;

  time_slot: 1 | 2 | 3;

  hall_id: number;
  table_id: number;

  team1_id: number;
  team2_id: number;
  arbiter_username: string;
  rating: number | null;
};
