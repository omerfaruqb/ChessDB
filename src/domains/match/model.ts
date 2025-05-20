import { getDatabase } from '../../shared/db';
import { Match } from "./types";
import { Pool } from 'mysql2/promise';

export class MatchModel {
    private static readonly TABLE_NAME = 'matches';
    private db: Pool;

    constructor() {
        this.db = getDatabase();
    }

    async createMatch(match: Omit<Match, 'match_id' | 'rating' | 'match_result'>): Promise<Match> {
        const [result] = await this.db.execute(
            `INSERT INTO ${MatchModel.TABLE_NAME} 
             (date, time_slot, hall_id, table_id, team1_id, team2_id, white_player_id, black_player_id, arbiter_username)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                match.date, 
                match.time_slot, 
                match.hall_id, 
                match.table_id,
                match.team1_id,
                match.team2_id,
                match.white_player_id,
                match.black_player_id,
                match.arbiter_username
            ]
        ) as any;
        
        const newMatch = await this.getMatch(result.insertId);
        if (!newMatch) {
            throw new Error('Failed to retrieve created match');
        }
        
        return newMatch;
    }

    async getMatch(matchId: number): Promise<Match | undefined> {
        const [rows] = await this.db.execute(
            `SELECT * FROM ${MatchModel.TABLE_NAME} WHERE match_id = ?`,
            [matchId]
        ) as any;
        
        return rows[0] as Match | undefined;
    }

    async updateMatch(matchId: number, updates: Partial<Match>): Promise<boolean> {
        const setClause = Object.keys(updates)
            .filter(key => key !== 'match_id')
            .map(key => `${key} = ?`)
            .join(', ');
            
        const values = Object.values(updates).filter((_, i) => Object.keys(updates)[i] !== 'match_id');
        
        if (values.length === 0) return false;
        
        const [result] = await this.db.execute(
            `UPDATE ${MatchModel.TABLE_NAME} SET ${setClause} WHERE match_id = ?`,
            [...values, matchId]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async deleteMatch(matchId: number): Promise<boolean> {
        const [result] = await this.db.execute(
            `DELETE FROM ${MatchModel.TABLE_NAME} WHERE match_id = ?`,
            [matchId]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async getMatchesByTeam(teamId: number): Promise<Match[]> {
        const [rows] = await this.db.execute(
            `SELECT * FROM ${MatchModel.TABLE_NAME} 
             WHERE team1_id = ? OR team2_id = ?
             ORDER BY date, time_slot`,
            [teamId, teamId]
        ) as any;
        
        return rows as Match[];
    }
    
    async getMatchesByPlayer(playerId: number): Promise<Match[]> {
        const [rows] = await this.db.execute(
            `SELECT * FROM ${MatchModel.TABLE_NAME} 
             WHERE white_player_id = ? OR black_player_id = ?
             ORDER BY date, time_slot`,
            [playerId, playerId]
        ) as any;
        
        return rows as Match[];
    }
    
    async getMatchesByArbiter(arbiterUsername: string): Promise<Match[]> {
        const [rows] = await this.db.execute(
            `SELECT * FROM ${MatchModel.TABLE_NAME} 
             WHERE arbiter_username = ?
             ORDER BY date, time_slot`,
            [arbiterUsername]
        ) as any;
        
        return rows as Match[];
    }
}
