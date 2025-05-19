import { SponsorModel } from "./model";
import { Sponsor } from "./types";


export class SponsorService {
    constructor(private sponsorModel: SponsorModel) {
        this.sponsorModel = sponsorModel;
    }
    async getSponsorById(id: number): Promise<Sponsor> {
        return this.sponsorModel.getSponsorById(id);
    }
    async getAllSponsors(): Promise<Sponsor[]> {
        return this.sponsorModel.getAllSponsors();
    }
    async createSponsor(sponsor: Sponsor): Promise<Sponsor> {
        return this.sponsorModel.createSponsor(sponsor);
    }
}
