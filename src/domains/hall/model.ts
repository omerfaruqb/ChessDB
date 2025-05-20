import { getDatabase, withTransaction } from '../../shared/db';
import { Hall } from "./types";
import { Pool } from 'mysql2/promise';

export class HallModel {
    private db: Pool;
    private static readonly TABLE_NAME = 'Halls';

    constructor(db: Pool) {
        this.db = db;
    }

    async createHall(hall: Omit<Hall, 'hall_id' | 'created_at' | 'updated_at'>): Promise<Hall> {
        try {
            const [result] = await this.db.execute(
                `INSERT INTO ${HallModel.TABLE_NAME} (hall_name, hall_country, hall_capacity) VALUES (?, ?, ?)`,
                [hall.hall_name, hall.hall_country, hall.hall_capacity]
            ) as any;
            
            const insertId = result.insertId;
            if (!insertId) {
                throw new Error('Failed to create hall: No insertId returned');
            }
            
            const newHall = await this.getHall(insertId);
            if (!newHall) {
                throw new Error('Failed to retrieve created hall');
            }
            
            return newHall;
        } catch (error) {
            console.error('Error creating hall:', error);
            throw error;
        }
    }

    async getHall(hallId: number): Promise<Hall | undefined> {
        try {
            const [rows] = await this.db.execute(
                `SELECT * FROM ${HallModel.TABLE_NAME} WHERE hall_id = ?`,
                [hallId]
            ) as any;
            
            return rows[0] as Hall | undefined;
        } catch (error) {
            console.error(`Error getting hall ${hallId}:`, error);
            throw error;
        }
    }

    async updateHall(hallId: number, updates: Partial<Hall>): Promise<Hall> {
        return withTransaction(async (conn) => {
            const setClause = Object.keys(updates)
                .filter(key => key !== 'hall_id' && key !== 'created_at' && key !== 'updated_at')
                .map(key => `${key} = ?`)
                .join(', ');

            const values = Object.entries(updates)
                .filter(([key]) => key !== 'hall_id' && key !== 'created_at' && key !== 'updated_at')
                .map(([_, value]) => value);

            if (values.length === 0) {
                throw new Error('No valid fields to update');
            }

            values.push(hallId);

            await conn.execute(
                `UPDATE ${HallModel.TABLE_NAME} 
                 SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
                 WHERE hall_id = ?`,
                values
            );

            const [rows] = await conn.execute(
                `SELECT * FROM ${HallModel.TABLE_NAME} WHERE hall_id = ?`,
                [hallId]
            ) as any;

            if (!rows[0]) {
                throw new Error('Failed to retrieve updated hall');
            }
            
            return rows[0] as Hall;
        });
    }

    // Additional useful methods
    async getAllHalls(): Promise<Hall[]> {
        try {
            const [rows] = await this.db.execute(
                `SELECT * FROM ${HallModel.TABLE_NAME} ORDER BY hall_name`
            ) as any;
            return rows as Hall[];
        } catch (error) {
            console.error('Error getting all halls:', error);
            throw error;
        }
    }

    async deleteHall(hallId: number): Promise<boolean> {
        try {
            const [result] = await this.db.execute(
                `DELETE FROM ${HallModel.TABLE_NAME} WHERE hall_id = ?`,
                [hallId]
            );
            return (result as any).affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting hall ${hallId}:`, error);
            throw error;
        }
    }
}

export function createHallModel(): HallModel {
    return new HallModel(getDatabase());
}