import { TitleModel } from "./model";
import { Title, titleID } from "./types";

export class TitleService {
    constructor(private titleModel: TitleModel) {
        this.titleModel = titleModel;
    }
    async getTitleById(id: titleID): Promise<Title> {
        return this.titleModel.getTitleById(id);
    }
}
