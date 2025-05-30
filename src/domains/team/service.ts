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
    async addPlayerToTeam(teamId: number, playerUsername: string): Promise<boolean> {
        return this.teamModel.addPlayerToTeam(teamId, playerUsername);
    }
    async removePlayerFromTeam(teamId: number, playerUsername: string): Promise<boolean> {
        return this.teamModel.removePlayerFromTeam(teamId, playerUsername);
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
    async getTeamPlayers(teamId: number): Promise<string[]> {
        return await this.teamModel.getTeamPlayersUsernames(teamId);
    }
    async getPlayerTeams(playerUsername: string): Promise<Team[]> {
        return await this.teamModel.getPlayerTeams(playerUsername);
    }
    
}

export function createTeamService(teamModel: TeamModel): TeamService {
    return new TeamService(teamModel);
}