import { HallModel } from "./model";
import { Hall } from "./types";


export class HallService {

    constructor(private readonly hallModel: HallModel) {
        this.hallModel = hallModel;
    }
    async createHall(hall: Hall): Promise<Hall> {
        return await this.hallModel.createHall(hall);
    }
    async getHall(hallId: number): Promise<Hall | undefined> {
        return await this.hallModel.getHall(hallId);
    }
    async updateHall(hallId: number, hall: Hall): Promise<Hall> {
        return await this.hallModel.updateHall(hallId, hall);
    }
    async deleteHall(hallId: number): Promise<boolean> {
        return await this.hallModel.deleteHall(hallId);
    }
    async getAllHalls(): Promise<Hall[]> {
        return await this.hallModel.getAllHalls();
    }
}

export function createHallService(hallModel: HallModel): HallService {
    return new HallService(hallModel);
}
