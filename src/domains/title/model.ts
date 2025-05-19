import { Title, titleID } from "./types";

const titleGM: Title = {
    title_id: 1,
    title_name: "Grandmaster",
}

const titleIM: Title = {
    title_id: 2,
    title_name: "International Master",
}
const titleFM: Title = {
    title_id: 3,
    title_name: "FIDE Master",
}
const titleCM: Title = {
    title_id: 4,
    title_name: "Candidate Master",
}
const titleNM: Title = {
    title_id: 5,
    title_name: "National Master",
}
const titleOptions = {
    "1": titleGM,
    "2": titleIM,
    "3": titleFM,
    "4": titleCM,
    "5": titleNM,
}

export class TitleModel {
    async getTitleById(id: titleID): Promise<Title> {
        return titleOptions[id];
    }
}
