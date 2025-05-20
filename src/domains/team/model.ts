import { getDatabase, withTransaction } from '../../shared/db';
import { Team, PlayerTeam } from "./types";
import { Pool } from 'mysql2/promise';
import { QueryResult } from 'mysql2/promise';

export class TeamModel {
    private static readonly TABLE_NAME = 'teams';
    private static readonly PLAYER_TEAM_TABLE = 'player_teams';
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async createTeam(team: Omit<Team, 'team_id'>): Promise<Team> { 
        return withTransaction(async (conn) => {
            const [result] = await conn.execute<QueryResult>(
                `INSERT INTO ${TeamModel.TABLE_NAME} (team_name, sponsor_id) VALUES (?, ?)`,
                [team.team_name, team.sponsor_id]
            ) as any;
            
            if (!result.insertId) {
                throw new Error('Failed to create team');
            }

            const newTeam = {
                team_id: result.insertId,
                ...team
            };
            
            return newTeam;
        });
    }

    async getTeamById(teamId: number, connection?: any): Promise<Team | undefined> {
        const [rows] = await this.db.query(
            `SELECT * FROM ${TeamModel.TABLE_NAME} WHERE team_id = ?`,
            [teamId]
        ) as any;
        
        return rows[0] as Team | undefined;
    }

    async getTeamByName(teamName: string): Promise<Team | undefined> {
        const [rows] = await this.db.query(
            `SELECT * FROM ${TeamModel.TABLE_NAME} WHERE team_name = ?`,
            [teamName]
        ) as any;
        
        return rows[0] as Team | undefined;
    }

    async updateTeam(teamId: number, updates: Partial<Team>): Promise<boolean> {
        const setClause = Object.keys(updates)
            .filter(key => key !== 'team_id')
            .map(key => `${key} = ?`)
            .join(', ');
            
        const values = Object.values(updates).filter((_, i) => Object.keys(updates)[i] !== 'team_id');
        
        if (values.length === 0) return false;
        
        const [result] = await this.db.execute(
            `UPDATE ${TeamModel.TABLE_NAME} SET ${setClause} WHERE team_id = ?`,
            [...values, teamId]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async deleteTeam(teamId: number): Promise<boolean> {
        return withTransaction(async (conn) => {
            // First delete all player associations
            await conn.execute(
                `DELETE FROM ${TeamModel.PLAYER_TEAM_TABLE} WHERE team_id = ?`,
                [teamId]
            );
            
            // Then delete the team
            const [result] = await conn.execute(
                `DELETE FROM ${TeamModel.TABLE_NAME} WHERE team_id = ?`,
                [teamId]
            ) as any;
            
            return result.affectedRows > 0;
        });
    }
    
    async getAllTeams(): Promise<Team[]> {
        const [rows] = await this.db.query(
            `SELECT t.*, s.sponsor_name 
             FROM ${TeamModel.TABLE_NAME} t
             LEFT JOIN sponsors s ON t.sponsor_id = s.sponsor_id
             ORDER BY t.team_name`
        ) as any;
        
        return rows as Team[];
    }
    
    async addPlayerToTeam(teamId: number, username: string): Promise<boolean> {
        try {
            await this.db.execute(
                `INSERT INTO ${TeamModel.PLAYER_TEAM_TABLE} (team_id, username) VALUES (?, ?)`,
                [teamId, username]
            );
            return true;
        } catch (error) {
            if ((error as any).code === 'ER_DUP_ENTRY') {
                return false; // Player already in team
            }
            throw error;
        }
    }
    
    async removePlayerFromTeam(teamId: number, username: string): Promise<boolean> {
        const [result] = await this.db.execute(
            `DELETE FROM ${TeamModel.PLAYER_TEAM_TABLE} 
             WHERE team_id = ? AND username = ?`,
            [teamId, username]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async getTeamPlayersUsernames(teamId: number): Promise<string[]> {
        const [rows] = await this.db.query(
            `SELECT username FROM ${TeamModel.PLAYER_TEAM_TABLE} 
             WHERE team_id = ?`,
            [teamId]
        ) as any;   
        
        return rows.map((row: any) => row.username);
    }
    
    async getPlayerTeams(username: string): Promise<Team[]> {
        const [rows] = await this.db.query(
            `SELECT t.* FROM ${TeamModel.TABLE_NAME} t
             JOIN ${TeamModel.PLAYER_TEAM_TABLE} pt ON t.team_id = pt.team_id
             WHERE pt.username = ?`,
            [username]
        ) as any;
        
        return rows as Team[];
    }

    async getPlayersOfTeam(teamId: number): Promise<PlayerTeam[]> {
        const [rows] = await this.db.query(
            `SELECT pt.username FROM ${TeamModel.PLAYER_TEAM_TABLE} pt
             WHERE pt.team_id = ?`,
            [teamId]
        ) as any;
        
        return rows as PlayerTeam[];
    }
}

export function createTeamModel(): TeamModel {
    return new TeamModel(getDatabase());
}
