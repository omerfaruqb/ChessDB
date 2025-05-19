import { getDatabase, withTransaction } from '../../shared/db';
import { ArbiterCertification } from "./types";

export class ArbiterCertificationModel {
    private static readonly TABLE_NAME = 'arbiter_certifications';

    async createCertification(certification: ArbiterCertification): Promise<ArbiterCertification> {
        const db = await getDatabase();
        const [result] = await db.execute(
            `INSERT INTO ${ArbiterCertificationModel.TABLE_NAME} (username, certification) VALUES (?, ?)`,
            [certification.username, certification.certification]
        );
        
        return {
            ...certification
        };
    }

    async getCertifications(username: string): Promise<ArbiterCertification[]> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT * FROM ${ArbiterCertificationModel.TABLE_NAME} WHERE username = ?`,
            [username]
        ) as any;
        
        return rows as ArbiterCertification[];
    }

    async updateCertification(
        username: string, 
        oldCertification: string,
        newCertification: string
    ): Promise<boolean> {
        const db = await getDatabase();
        const [result] = await db.execute(
            `UPDATE ${ArbiterCertificationModel.TABLE_NAME} 
             SET certification = ? 
             WHERE username = ? AND certification = ?`,
            [newCertification, username, oldCertification]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async deleteCertification(username: string, certification: string): Promise<boolean> {
        const db = await getDatabase();
        const [result] = await db.execute(
            `DELETE FROM ${ArbiterCertificationModel.TABLE_NAME} 
             WHERE username = ? AND certification = ?`,
            [username, certification]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async getAllCertifications(): Promise<ArbiterCertification[]> {
        const db = await getDatabase();
        const [rows] = await db.query(
            `SELECT * FROM ${ArbiterCertificationModel.TABLE_NAME}`
        ) as any;
        
        return rows as ArbiterCertification[];
    }
}