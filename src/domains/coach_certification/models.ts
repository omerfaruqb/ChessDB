import { CoachCertification } from "./types";

const mockCoachCertification: CoachCertification = {
    username: "testuser",
    certification: "testcertification",
}

export class CoachCertificationModel {
    async createCoachCertification(coachCertification: CoachCertification): Promise<CoachCertification> {
        return mockCoachCertification;
    }
    async getCoachCertification(coachCertificationId: string): Promise<CoachCertification> {
        return mockCoachCertification;
    }
    async updateCoachCertification(coachCertificationId: string, coachCertification: CoachCertification): Promise<CoachCertification> {
        return mockCoachCertification;
    }
    
}