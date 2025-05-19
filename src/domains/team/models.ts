import { getDatabase, withTransaction } from '../../shared/db';
import { Team, PlayerTeam } from "./types";

export class TeamModel {
    private static readonly TABLE_NAME = 'teams';
    private static readonly PLAYER_TEAM_TABLE = 'player_teams';

    async createTeam(team: Omit<Team, 'team_id'>): Promise<Team> {
        const db = await getDatabase();
        
        return withTransaction(async (conn) => {
            const [result] = await conn.execute(
                `INSERT INTO ${TeamModel.TABLE_NAME} (team_name, sponsor_id) VALUES (?, ?)`,
                [team.team_name, team.sponsor_id]
            ) as any;
            
            const newTeam = await this.getTeam(conn, result.insertId);
            if (!newTeam) {
                throw new Error('Failed to retrieve created team');
            }
            
            return newTeam;
        });
    }

    async getTeam(teamId: number, connection?: any): Promise<Team | undefined> {
        const db = connection || (await getDatabase());
        const [rows] = await db.query(
            `SELECT * FROM ${TeamModel.TABLE_NAME} WHERE team_id = ?`,
            [teamId]
        ) as any;
        
        return rows[0] as Team | undefined;
    }

    async updateTeam(teamId: number, updates: Partial<Team>): Promise<boolean> {
        const db = await getDatabase();
        const setClause = Object.keys(updates)
            .filter(key => key !== 'team_id')
            .map(key => `${key} = ?`)
            .join(', ');
            
        const values = Object.values(updates).filter((_, i) => Object.keys(updates)[i] !== 'team_id');
        
        if (values.length === 0) return false;
        
        const [result] = await db.execute(
            `UPDATE ${TeamModel.TABLE_NAME} SET ${setClause} WHERE team_id = ?`,
            [...values, teamId]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async deleteTeam(teamId: number): Promise<boolean> {
        const db = await getDatabase();
        
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
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT t.*, s.sponsor_name 
             FROM ${TeamModel.TABLE_NAME} t
             LEFT JOIN sponsors s ON t.sponsor_id = s.sponsor_id
             ORDER BY t.team_name`
        ) as any;
        
        return rows as Team[];
    }
    
    async addPlayerToTeam(teamId: number, playerId: number): Promise<boolean> {
        const db = await getDatabase();
        
        try {
            await db.execute(
                `INSERT INTO ${TeamModel.PLAYER_TEAM_TABLE} (team_id, player_id) VALUES (?, ?)`,
                [teamId, playerId]
            );
            return true;
        } catch (error) {
            if ((error as any).code === 'ER_DUP_ENTRY') {
                return false; // Player already in team
            }
            throw error;
        }
    }
    
    async removePlayerFromTeam(teamId: number, playerId: number): Promise<boolean> {
        const db = await getDatabase();
        const [result] = await db.execute(
            `DELETE FROM ${TeamModel.PLAYER_TEAM_TABLE} 
             WHERE team_id = ? AND player_id = ?`,
            [teamId, playerId]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async getTeamPlayers(teamId: number): Promise<number[]> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT player_id FROM ${TeamModel.PLAYER_TEAM_TABLE} 
             WHERE team_id = ?`,
            [teamId]
        ) as any;
        
        return rows.map((row: any) => row.player_id);
    }
    
    async getPlayerTeams(playerId: number): Promise<Team[]> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT t.* FROM ${TeamModel.TABLE_NAME} t
             JOIN ${TeamModel.PLAYER_TEAM_TABLE} pt ON t.team_id = pt.team_id
             WHERE pt.player_id = ?`,
            [playerId]
        ) as any;
        
        return rows as Team[];
    }
}
