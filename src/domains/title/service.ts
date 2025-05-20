import { TitleModel } from "./model";
import { Title } from "./types";

export class TitleService {
    constructor(private titleModel: TitleModel) {
        this.titleModel = titleModel;
    }
    async getTitleById(id: number): Promise<Title> {
        const title = await this.titleModel.getTitleById(id);
        if (!title) {
            throw new Error(`Title with ID ${id} not found`);
        }
        return title;
    }
}
