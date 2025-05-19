import { TeamModel } from "../models/teamModel";
import { Team, PlayerTeam } from "../types/teamTypes";

export class TeamService {
    constructor(private teamModel: TeamModel) {
        this.teamModel = teamModel;
    }
    async getTeamById(id: number): Promise<Team> {
        return this.teamModel.getTeamById(id);
    }
    async getTeamByName(name: string): Promise<Team> {
        return this.teamModel.getTeamByName(name);
    }
    async getPlayersOfTeam(teamId: number): Promise<PlayerTeam[]> {
        return this.teamModel.getPlayersOfTeam(teamId);
    }
    async addPlayerToTeam(playerId: number, teamId: number): Promise<PlayerTeam> {
        return this.teamModel.addPlayerToTeam(playerId, teamId);
    }
    async removePlayerFromTeam(playerId: number, teamId: number): Promise<PlayerTeam> {
        return this.teamModel.removePlayerFromTeam(playerId, teamId);
    }
}

