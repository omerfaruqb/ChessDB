import { TableModel } from "./model";
import { Table } from "./types";

export class TableService {
    constructor(private tableModel: TableModel) {
        this.tableModel = tableModel;
    }
    async getTableById(id: number): Promise<Table> {
        return this.tableModel.getTableById(id);
    }
}

