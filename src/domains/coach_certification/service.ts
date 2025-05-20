import { CoachCertificationModel } from "./model";
import { CoachCertification } from "./types";

export class CoachCertificationService {

    constructor(private readonly coachCertificationModel: CoachCertificationModel) {
        this.coachCertificationModel = coachCertificationModel;
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

export function createCoachCertificationService(coachCertificationModel: CoachCertificationModel): CoachCertificationService {
    return new CoachCertificationService(coachCertificationModel);
}