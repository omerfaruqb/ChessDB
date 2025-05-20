import { TitleModel } from "./model";
import { Title } from "./types";
import { getDatabase } from "@/shared/db";
export class TitleService {
    private readonly titleModel: TitleModel;

    constructor() {
        this.titleModel = new TitleModel(getDatabase());
    }
    async getTitleById(id: number): Promise<Title> {
        const title = await this.titleModel.getTitleById(id);
        if (!title) {
            throw new Error(`Title with ID ${id} not found`);
        }
        return title;
    }
}
