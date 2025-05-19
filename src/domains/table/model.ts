import { Table } from "./types";

const mockTable: Table = {
    table_id: 1,
    hall_id: 1,
}

export class TableModel {
    async getTableById(id: number): Promise<Table> {
        return mockTable;
    }
}
