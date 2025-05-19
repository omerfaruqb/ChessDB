import { getDatabase } from '../../shared/db';
import { Title } from "./types";

export class TitleModel {
    private static readonly TABLE_NAME = 'titles';
    private static readonly PLAYER_TITLE_TABLE = 'player_titles';

    async getAllTitles(): Promise<Title[]> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT * FROM ${TitleModel.TABLE_NAME} ORDER BY title_name`
        ) as any;
        
        return rows as Title[];
    }

    async getTitle(titleId: number): Promise<Title | undefined> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT * FROM ${TitleModel.TABLE_NAME} WHERE title_id = ?`,
            [titleId]
        ) as any;
        
        return rows[0] as Title | undefined;
    }

    async assignTitleToPlayer(playerId: number, titleId: number): Promise<boolean> {
        const db = await getDatabase();
        
        try {
            await db.execute(
                `INSERT INTO ${TitleModel.PLAYER_TITLE_TABLE} (player_id, title_id) VALUES (?, ?)`,
                [playerId, titleId]
            );
            return true;
        } catch (error) {
            if ((error as any).code === 'ER_DUP_ENTRY') {
                return false; // Player already has this title
            }
            throw error;
        }
    }
    
    async removeTitleFromPlayer(playerId: number, titleId: number): Promise<boolean> {
        const db = await getDatabase();
        const [result] = await db.execute(
            `DELETE FROM ${TitleModel.PLAYER_TITLE_TABLE} 
             WHERE player_id = ? AND title_id = ?`,
            [playerId, titleId]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async getPlayerTitles(playerId: number): Promise<Title[]> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT t.* FROM ${TitleModel.TABLE_NAME} t
             JOIN ${TitleModel.PLAYER_TITLE_TABLE} pt ON t.title_id = pt.title_id
             WHERE pt.player_id = ?`,
            [playerId]
        ) as any;
        
        return rows as Title[];
    }
    
    async getPlayersWithTitle(titleId: number): Promise<number[]> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT player_id FROM ${TitleModel.PLAYER_TITLE_TABLE} 
             WHERE title_id = ?`,
            [titleId]
        ) as any;
        
        return rows.map((row: any) => row.player_id);
    }
    
    async hasTitle(playerId: number, titleId: number): Promise<boolean> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT 1 FROM ${TitleModel.PLAYER_TITLE_TABLE} 
             WHERE player_id = ? AND title_id = ?`,
            [playerId, titleId]
        ) as any;
        
        return rows.length > 0;
    }
}
