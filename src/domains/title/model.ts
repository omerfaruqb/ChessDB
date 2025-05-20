import { getDatabase } from '../../shared/db';
import { Title } from "./types";
import { Pool } from 'mysql2/promise';

// const titleGM: Title = {
//     title_id: 1,
//     title_name: "Grandmaster",
// }

// const titleIM: Title = {
//     title_id: 2,
//     title_name: "International Master",
// }
// const titleFM: Title = {
//     title_id: 3,
//     title_name: "FIDE Master",
// }
// const titleCM: Title = {
//     title_id: 4,
//     title_name: "Candidate Master",
// }
// const titleNM: Title = {
//     title_id: 5,
//     title_name: "National Master",
// }
// const titleOptions = {
//     "1": titleGM,
//     "2": titleIM,
//     "3": titleFM,
//     "4": titleCM,
//     "5": titleNM,
// }


export class TitleModel {
    private static readonly TABLE_NAME = 'titles';
    private static readonly PLAYER_TITLE_TABLE = 'player_titles';
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async getAllTitles(): Promise<Title[]> {
        const [rows] = await this.db.query(
            `SELECT * FROM ${TitleModel.TABLE_NAME} ORDER BY title_name`
        ) as any[];
        
        return rows as Title[];
    }

    async getTitleById(titleId: number): Promise<Title | undefined> {
        const [rows] = await this.db.query(
            `SELECT * FROM ${TitleModel.TABLE_NAME} WHERE title_id = ?`,
            [titleId]
        ) as any[];
        
        return rows[0] as Title | undefined;
    }
}

export function createTitleModel(): TitleModel {
    return new TitleModel(getDatabase());
}
