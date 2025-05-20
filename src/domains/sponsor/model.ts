import { getDatabase, withTransaction } from '../../shared/db';
import { Sponsor } from "./types";
import { Pool } from 'mysql2/promise';

export class SponsorModel {
    private static readonly TABLE_NAME = 'sponsors';
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async createSponsor(sponsor: Omit<Sponsor, 'sponsor_id'>): Promise<Sponsor> {
        const [result] = await this.db.execute(
            `INSERT INTO ${SponsorModel.TABLE_NAME} (sponsor_name) VALUES (?)`,
            [sponsor.sponsor_name]
        ) as any;
        
        const newSponsor = await this.getSponsor(result.insertId);
        if (!newSponsor) {
            throw new Error('Failed to retrieve created sponsor');
        }
        
        return newSponsor;
    }

    async getSponsor(sponsorId: number): Promise<Sponsor | undefined> {
        const [rows] = await this.db.query(
            `SELECT * FROM ${SponsorModel.TABLE_NAME} WHERE sponsor_id = ?`,
            [sponsorId]
        ) as any;
        
        return rows[0] as Sponsor | undefined;
    }

    async updateSponsor(sponsorId: number, updates: Partial<Sponsor>): Promise<boolean> {
        const setClause = Object.keys(updates)
            .filter(key => key !== 'sponsor_id')
            .map(key => `${key} = ?`)
            .join(', ');
            
        const values = Object.values(updates).filter((_, i) => Object.keys(updates)[i] !== 'sponsor_id');
        
        if (values.length === 0) return false;
        
        const [result] = await this.db.execute(
            `UPDATE ${SponsorModel.TABLE_NAME} SET ${setClause} WHERE sponsor_id = ?`,
            [...values, sponsorId]
        ) as any;
        
        return result.affectedRows > 0;
    }
    
    async deleteSponsor(sponsorId: number): Promise<boolean> {
        const [result] = await this.db.execute(
            `DELETE FROM ${SponsorModel.TABLE_NAME} WHERE sponsor_id = ?`,
            [sponsorId]
        ) as any;   
        
        return result.affectedRows > 0;
    }
    
    async getAllSponsors(): Promise<Sponsor[]> {
        const [rows] = await this.db.query(
            `SELECT * FROM ${SponsorModel.TABLE_NAME} ORDER BY sponsor_name`
        ) as any;
        
        return rows as Sponsor[];
    }
    
    async searchSponsors(query: string): Promise<Sponsor[]> {
        const searchTerm = `%${query}%`;
        const [rows] = await this.db.query(
            `SELECT * FROM ${SponsorModel.TABLE_NAME} 
             WHERE sponsor_name LIKE ? 
             ORDER BY sponsor_name`,
            [searchTerm]
        ) as any;
        
        return rows as Sponsor[];
    }
}
