import { CoachCertification } from "./types";
import { getDatabase } from "../../shared/db";
import { Pool } from 'mysql2/promise';

export class CoachCertificationModel {
    private static readonly TABLE_NAME = 'coach_certifications';
    private db: Pool;

    constructor() {
        this.db = getDatabase();
    }

    async createCoachCertification(coachCertification: CoachCertification): Promise<CoachCertification> {
        const [result] = await this.db.execute(
            `INSERT INTO ${CoachCertificationModel.TABLE_NAME} (username, certification) VALUES (?, ?)`,
            [coachCertification.username, coachCertification.certification]
        );
        
        return {
            ...coachCertification
        };
    }

    async getCoachCertification(username: string): Promise<CoachCertification[]> {
        const [rows] = await this.db.execute(
            `SELECT * FROM ${CoachCertificationModel.TABLE_NAME} WHERE username = ?`,
            [username]
        );
        
        return rows as CoachCertification[];
    }

    async updateCoachCertification(
        username: string, 
        oldCertification: string,
        newCertification: string
    ): Promise<boolean> {
        const [result] = await this.db.execute(
            `UPDATE ${CoachCertificationModel.TABLE_NAME} 
             SET certification = ? 
             WHERE username = ? AND certification = ?`,
            [newCertification, username, oldCertification]
        );
        
        return (result as any).affectedRows > 0;
    }
    
    async deleteCoachCertification(username: string, certification: string): Promise<boolean> {
        const [result] = await this.db.execute(
            `DELETE FROM ${CoachCertificationModel.TABLE_NAME} 
             WHERE username = ? AND certification = ?`,
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