import { SponsorModel } from "./model";
import { Sponsor } from "./types";
import { getDatabase } from "../../shared/db";

export class SponsorService {
    private readonly sponsorModel: SponsorModel;

    constructor() {
        this.sponsorModel = new SponsorModel(getDatabase());
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
