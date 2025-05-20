import { TableModel } from "./model";
import { Table } from "./types";

export class TableService {
    constructor(private readonly tableModel: TableModel) {
        this.tableModel = tableModel;
    }
    async getTable(id: number): Promise<Table> {
        return await this.tableModel.getTable(id);
    }
    async createTable(table: Table): Promise<Table> {
        return await this.tableModel.createTable(table);
    }
    async updateTable(id: number, table: Table): Promise<boolean> {
        return await this.tableModel.updateTable(id, table);
    }
    async deleteTable(id: number): Promise<boolean> {
        return await this.tableModel.deleteTable(id);
    }
    async getTablesByHall(hallId: number): Promise<Table[]> {
        return await this.tableModel.getTablesByHall(hallId);
    }
    async isTableInUse(tableId: number, date: string, timeSlot: number): Promise<boolean> {
        return await this.tableModel.isTableInUse(tableId, date, timeSlot);
    }
}

