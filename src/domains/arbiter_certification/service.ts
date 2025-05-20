import { ArbiterCertificationModel } from "./model";
import {ArbiterCertification } from "./types";
import { getDatabase } from "../../shared/db";

export class ArbiterCertificationService {
    constructor(private readonly arbiterCertificationModel: ArbiterCertificationModel) {
        this.arbiterCertificationModel = arbiterCertificationModel;
    }

    async createCertification(certification: ArbiterCertification): Promise<ArbiterCertification> {
        return await this.arbiterCertificationModel.createCertification(certification);
    }

    async getCertifications(username: string): Promise<ArbiterCertification[]> {
        return await this.arbiterCertificationModel.getCertifications(username);
    }

    async updateCertification(username: string, oldCertification: string, newCertification: string): Promise<boolean> {
        return await this.arbiterCertificationModel.updateCertification(username, oldCertification, newCertification);
    }

    async deleteCertification(username: string, certification: string): Promise<boolean> {
        return await this.arbiterCertificationModel.deleteCertification(username, certification);
    }

    async getAllCertifications(): Promise<ArbiterCertification[]> {
        return await this.arbiterCertificationModel.getAllCertifications();
    }
    
    
}