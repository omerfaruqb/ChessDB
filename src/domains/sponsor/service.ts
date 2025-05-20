import { SponsorModel } from "./model";
import { Sponsor } from "./types";

export class SponsorService {
    constructor(private readonly sponsorModel: SponsorModel) {
        this.sponsorModel = sponsorModel;
    }

    async getSponsorById(id: number): Promise<Sponsor> {
        return await this.sponsorModel.getSponsor(id);
    }
    async getAllSponsors(): Promise<Sponsor[]> {
        return await this.sponsorModel.getAllSponsors();
    }
    async createSponsor(sponsor: Sponsor): Promise<Sponsor> {
        return await this.sponsorModel.createSponsor(sponsor);
    }
    async updateSponsor(id: number, sponsor: Sponsor): Promise<boolean> {
        return await this.sponsorModel.updateSponsor(id, sponsor);
    }
    async deleteSponsor(id: number): Promise<boolean> {
        return await this.sponsorModel.deleteSponsor(id);
    }
}

export function createSponsorService(sponsorModel: SponsorModel): SponsorService {
    return new SponsorService(sponsorModel);
}
