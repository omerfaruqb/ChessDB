import { Match, MatchResult } from "../types/index";

const mockMatch: Match = {
    match_id: 1,
    date: "01-01-2021",
    time_slot: 1,
    hall_id: 1,
    table_id: 1,
    team1_id: 1,
    team2_id: 2,
    white_player_id: 1,
    black_player_id: 2,
    match_result: "white_wins",
    arbiter_username: "arbiter1",
    rating: 1500,
}

export class MatchModel {
    async createMatch(match: Match): Promise<Match> {
        return mockMatch;
    }
    async getMatch(matchId: number): Promise<Match> {
        return mockMatch;
    }
    async updateMatch(matchId: number, match: Match): Promise<Match> {
        return mockMatch;
    }
    async getMatchesByPlayerId(playerId: number): Promise<Match[]> {
        return [mockMatch];
    }
    async submitResult(matchId: number, result: MatchResult): Promise<Match> {
        return mockMatch;
    }
}
