import { getDatabase, withTransaction } from '../../shared/db';
import { Table } from "./types";

export class TableModel {
    private static readonly TABLE_NAME = 'tables';

    async createTable(table: Omit<Table, 'table_id'>): Promise<Table> {
        const db = await getDatabase();
        const [result] = await db.execute(
            `INSERT INTO ${TableModel.TABLE_NAME} (hall_id) VALUES (?)`,
            [table.hall_id]
        ) as any;
        
        const newTable = await this.getTable(result.insertId);
        if (!newTable) {
            throw new Error('Failed to retrieve created table');
        }
        
        return newTable;
    }

    async getTable(tableId: number): Promise<Table | undefined> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT * FROM ${TableModel.TABLE_NAME} WHERE table_id = ?`,
            [tableId]
        ) as any;
        
        return rows[0] as Table | undefined;
    }

    async getTablesByHall(hallId: number): Promise<Table[]> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT * FROM ${TableModel.TABLE_NAME} WHERE hall_id = ?`,
            [hallId]
        ) as any;
        
        return rows as Table[];
    }
    
    async updateTable(tableId: number, updates: Partial<Table>): Promise<boolean> {
        const db = await getDatabase();
        const setClause = Object.keys(updates)
            .filter(key => key !== 'table_id')
            .map(key => `${key} = ?`)
            .join(', ');
            
        const values = Object.values(updates).filter((_, i) => Object.keys(updates)[i] !== 'table_id');
        
        if (values.length === 0) return false;
        
        const [result] = await db.execute(
            `UPDATE ${TableModel.TABLE_NAME} SET ${setClause} WHERE table_id = ?`,
            [...values, tableId]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async deleteTable(tableId: number): Promise<boolean> {
        const db = await getDatabase();
        const [result] = await db.execute(
            `DELETE FROM ${TableModel.TABLE_NAME} WHERE table_id = ?`,
            [tableId]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async isTableInUse(tableId: number, date: string, timeSlot: number): Promise<boolean> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT 1 FROM matches 
             WHERE table_id = ? AND date = ? AND time_slot = ?`,
            [tableId, date, timeSlot]
        ) as any;
        
        return rows.length > 0;
    }
}
