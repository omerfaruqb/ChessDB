import { TeamModel } from "./model";
import { Team, PlayerTeam } from "./types";

export class TeamService {
    constructor(private teamModel: TeamModel) {
        this.teamModel = teamModel;
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
}

