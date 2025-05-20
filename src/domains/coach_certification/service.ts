import { CoachCertificationModel } from "./model";
import { CoachCertification } from "./types";
import { getDatabase } from "../../shared/db";

export class CoachCertificationService {
    private readonly coachCertificationModel: CoachCertificationModel;

    constructor() {
        this.coachCertificationModel = new CoachCertificationModel(getDatabase());
    }

    async createCertification(certification: CoachCertification): Promise<CoachCertification> {
        return await this.coachCertificationModel.createCoachCertification(certification);
    }

    async getCertifications(username: string): Promise<CoachCertification[]> {
        return await this.coachCertificationModel.getCoachCertification(username);
    }

    async updateCertification(username: string, oldCertification: string, newCertification: string): Promise<boolean> {
        return await this.coachCertificationModel.updateCoachCertification(username, oldCertification, newCertification);
    }

    async deleteCertification(username: string, certification: string): Promise<boolean> {
        return await this.coachCertificationModel.deleteCoachCertification(username, certification);
    }

    async getAllCertifications(): Promise<CoachCertification[]> {
        return await this.coachCertificationModel.getAllCertifications();
    }
}