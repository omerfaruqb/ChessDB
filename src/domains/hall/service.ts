import { HallModel } from "./model";
import { Hall } from "./types";



export class HallService {
    constructor(private hallModel: HallModel) {
        this.hallModel = hallModel;
    }
    async createHall(hall: Hall): Promise<Hall> {
        return this.hallModel.createHall(hall);
    }
    async getHall(hallId: number): Promise<Hall | undefined> {
        return this.hallModel.getHall(hallId);
    }
    async updateHall(hallId: number, hall: Hall): Promise<Hall> {
        return this.hallModel.updateHall(hallId, hall);
    }
}