import { TeamModel } from "./model";
import { Team, PlayerTeam } from "./types";

export class TeamService {
    constructor(private readonly teamModel: TeamModel) {
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
    async createTeam(team: Team): Promise<Team> {
        return await this.teamModel.createTeam(team);
    }
    async updateTeam(id: number, team: Team): Promise<boolean> {
        return await this.teamModel.updateTeam(id, team);
    }
    async deleteTeam(id: number): Promise<boolean> {
        return await this.teamModel.deleteTeam(id);
    }
    async getAllTeams(): Promise<Team[]> {
        return await this.teamModel.getAllTeams();
    }
    async getTeamPlayers(teamId: number): Promise<number[]> {
        return await this.teamModel.getTeamPlayersIds(teamId);
    }
    async getPlayerTeams(playerId: number): Promise<Team[]> {
        return await this.teamModel.getPlayerTeams(playerId);
    }
    
}

export function createTeamService(teamModel: TeamModel): TeamService {
    return new TeamService(teamModel);
}