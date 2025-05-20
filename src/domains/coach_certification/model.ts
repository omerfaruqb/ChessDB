import { CoachCertification } from "./types";
import { Pool, ResultSetHeader } from "mysql2/promise";
import { getDatabase } from "@/shared/db";
export class CoachCertificationModel {
    private static readonly TABLE_NAME = 'coach_has_certification';
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async createCoachCertification(coachCertification: CoachCertification): Promise<CoachCertification> {
        const [result] = await this.db.execute<ResultSetHeader>(
            `INSERT INTO ${CoachCertificationModel.TABLE_NAME} (username, certification_name) VALUES (?, ?)`,
            [coachCertification.username, coachCertification.certification_name]
        );

        if (result.affectedRows === 0) {
            throw new Error('Failed to create coach certification');
        }
        
        return {
            ...coachCertification
        };
    }

    async getCoachCertification(username: string): Promise<CoachCertification[]> {
        const [rows] = await this.db.execute(
            `SELECT * FROM ${CoachCertificationModel.TABLE_NAME} WHERE username = ?`,
            [username]
        );
       
        return (rows as any[]) as CoachCertification[];
    }

    async updateCoachCertification(
        username: string, 
        oldCertification: string,
        newCertification: string
    ): Promise<boolean> {
        const [result] = await this.db.execute(
            `UPDATE ${CoachCertificationModel.TABLE_NAME} 
             SET certification_name = ? 
             WHERE username = ? AND certification_name = ?`,
            [newCertification, username, oldCertification]
        );
        
        return (result as any).affectedRows > 0;
    }
    
    async deleteCoachCertification(username: string, certification: string): Promise<boolean> {
        const [result] = await this.db.execute(
            `DELETE FROM ${CoachCertificationModel.TABLE_NAME} 
             WHERE username = ? AND certification_name = ?`,
            [username, certification]
        );
        
        return (result as any).affectedRows > 0;
    }
    
    async getAllCertifications(): Promise<CoachCertification[]> {
        const [rows] = await this.db.execute(
            `SELECT * FROM ${CoachCertificationModel.TABLE_NAME}`
        );
        
        return rows as CoachCertification[];
    }
}

export function createCoachCertificationModel(): CoachCertificationModel {
    return new CoachCertificationModel(getDatabase());
}