import { getDatabase } from "@/shared/db";
import { TeamModel } from "./model";
import { Team, PlayerTeam } from "./types";

export class TeamService {
    private readonly teamModel: TeamModel;

    constructor() {
        this.teamModel = new TeamModel(getDatabase());
    }
    async getTeamById(id: number): Promise<Team> {
        const team = await this.teamModel.getTeamById(id);
        if (!team) {
            throw new Error('Team not found');
        }
        return team;
    }
    async getTeamByName(name: string): Promise<Team> {
        const team = await this.teamModel.getTeamByName(name);
        if (!team) {
            throw new Error('Team not found');
        }
        return team;
    }
    async getPlayersOfTeam(teamId: number): Promise<PlayerTeam[]> {
        return this.teamModel.getPlayersOfTeam(teamId);
    }
    async addPlayerToTeam(playerId: number, teamId: number): Promise<boolean> {
        return this.teamModel.addPlayerToTeam(playerId, teamId);
    }
    async removePlayerFromTeam(playerId: number, teamId: number): Promise<boolean> {
        return this.teamModel.removePlayerFromTeam(playerId, teamId);
    }
    async createTeam(team: Team): Promise<Team> {
        return await this.teamModel.createTeam(team);
    }
    async updateTeam(id: number, team: Team): Promise<boolean> {
        return await this.teamModel.updateTeam(id, team);
    }
}

