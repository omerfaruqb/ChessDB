import { Hall } from "./types";

const mockHall: Hall = {
    hall_id: 1,
    hall_name: "testhall",
    country: "testcountry",
    capacity: 100,
}

export class HallModel {
    async createHall(hall: Hall): Promise<Hall> {
        return mockHall;
    }
    async getHall(hallId: number): Promise<Hall> {
        return mockHall;
    }
    async updateHall(hallId: number, hall: Hall): Promise<Hall> {
        return mockHall; // be careful with this, it should be only called by the admin
    }
}
