import { Sponsor } from "../types/sponsorTypes";

const mockSponsor: Sponsor = {
    sponsor_id: 1,
    sponsor_name: "Sponsor 1"
}

export class SponsorModel {
    async getSponsorById(id: number): Promise<Sponsor> {
        return mockSponsor;
    }
    async getAllSponsors(): Promise<Sponsor[]> {
        return [mockSponsor];
    }
    async createSponsor(sponsor: Sponsor): Promise<Sponsor> {
        return mockSponsor;
    }
}
