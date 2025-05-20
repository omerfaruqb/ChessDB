import { MatchModel } from './model';
import { Match } from './types';

/**
 * Service for managing chess matches
 */
export class MatchService {


  constructor(private readonly matchModel: MatchModel) {
    this.matchModel = matchModel;
  }

  async createMatch(data: Match): Promise<Match> {
    // Matches must not overlap in time or place. Each match lasts 2 consecutive time slots. 
    // Constraints such as arbiter/player availability and hall/table
    // usage should be considered. You are free to enforce these using triggers, procedures, or query validation.
    return this.matchModel.createMatch(data);
  }
  
  async getMatch(matchId: number): Promise<Match | undefined> {
    return this.matchModel.getMatch(matchId);
  }

  async updateMatch(matchId: number, data: Partial<Match>): Promise<boolean> {
    return this.matchModel.updateMatch(matchId, data as Match);
  }

  async deleteMatch(matchId: number): Promise<boolean> {
    return this.matchModel.deleteMatch(matchId);
  }
  
  async getMatchById(id: number): Promise<Match | undefined> {
    return this.matchModel.getMatch(id);
  }

  async getMatchesByPlayer(playerId: number): Promise<Match[]> {
    return this.matchModel.getMatchesByPlayer(playerId);
  }

  async getMatchesByTeam(teamId: number): Promise<Match[]> {
    return this.matchModel.getMatchesByTeam(teamId);
  }

  async getMatchesByArbiter(arbiterUsername: string): Promise<Match[]> {
    return this.matchModel.getMatchesByArbiter(arbiterUsername);
  }

}

