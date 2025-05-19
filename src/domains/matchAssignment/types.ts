export type MatchRow = {
    match_id: number;

    white_player: string;
    black_player: string;

  
    result: MatchResult;
  };


export type MatchResult = 'white_wins' | 'black_wins' | 'draw';