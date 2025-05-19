import { MatchModel } from './model';
import { Match, MatchResult } from './types';
/**
 * Service for managing chess matches
 */
export class MatchService {

  constructor(private matchModel: MatchModel) {
    this.matchModel = matchModel;
  }

  async createMatch(data: Match): Promise<Match> {
    // Matches must not overlap in time or place. Each match lasts 2 consecutive time slots. 
    // Constraints such as arbiter/player availability and hall/table
    // usage should be considered. You are free to enforce these using triggers, procedures, or query validation.
    return this.matchModel.createMatch(data);
  }
  
  async getMatchById(id: number): Promise<Match> {
    return this.matchModel.getMatch(id);
  }

  async getMatchesByPlayerId(playerId: number): Promise<Match[]> {
    return this.matchModel.getMatchesByPlayerId(playerId);
  }

  async updateMatch(id: number, data: Partial<Match>): Promise<Match> {
    return this.matchModel.updateMatch(id, data as Match);
  }
  
  async submitResult(id: number, result: MatchResult): Promise<Match> {
    return this.matchModel.submitResult(id, result);
  }
}

