import { getDatabase } from '../../shared/db';
import { ArbiterCertification } from "./types";
import { Pool, ResultSetHeader } from 'mysql2/promise';

export class ArbiterCertificationModel {
    private static readonly TABLE_NAME = 'arbiter_has_certification';
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async createCertification(certification: ArbiterCertification): Promise<ArbiterCertification> {
        const [result] = await this.db.execute<ResultSetHeader>(
            `INSERT INTO ${ArbiterCertificationModel.TABLE_NAME} (username, certification_name) VALUES (?, ?)`,
            [certification.username, certification.certification_name]
        );

        if (result.affectedRows === 0) {
            throw new Error('Failed to create certification');
        }
        
        return {
            ...certification
        };
    }

    async getCertifications(username: string): Promise<ArbiterCertification[]> {
        const [rows] = await this.db.execute(
            `SELECT * FROM ${ArbiterCertificationModel.TABLE_NAME} WHERE username = ?`,
            [username]
        );
        
        return (rows as any[]) as ArbiterCertification[];
    }

    async updateCertification(
        username: string, 
        oldCertification: string,
        newCertification: string
    ): Promise<boolean> {
        const [result] = await this.db.execute<ResultSetHeader>(
            `UPDATE ${ArbiterCertificationModel.TABLE_NAME} 
             SET certification_name = ? 
             WHERE username = ? AND certification_name = ?`,
            [newCertification, username, oldCertification]
        );
        
        return result.affectedRows > 0;
    }
    
    async deleteCertification(username: string, certification: string): Promise<boolean> {
        const [result] = await this.db.execute<ResultSetHeader>(
            `DELETE FROM ${ArbiterCertificationModel.TABLE_NAME} 
             WHERE username = ? AND certification_name = ?`,
            [username, certification]
        );
        
        return result.affectedRows > 0;
    }
    
    async getAllCertifications(): Promise<ArbiterCertification[]> {
        const [rows] = await this.db.query(
            `SELECT * FROM ${ArbiterCertificationModel.TABLE_NAME}`
        ) 
        
        return (rows as any) as ArbiterCertification[];
    }
}

export function createArbiterCertificationModel(): ArbiterCertificationModel {
    return new ArbiterCertificationModel(getDatabase());
}