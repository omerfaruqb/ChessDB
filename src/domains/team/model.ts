import { Team } from "./types";
import { PlayerTeam } from "./types";

const mockTeam: Team = {
    team_id: 1,
    team_name: "Team 1",
    sponsor_id: 1,
}

const mockPlayerTeam: PlayerTeam = {
    player_id: 1,
    team_id: 1,
}
const mockPlayerTeam2: PlayerTeam = {
    player_id: 2,
    team_id: 1,
}

export class TeamModel {
    async getTeamById(id: number): Promise<Team> {
        return mockTeam;
    }
    async getTeamByName(name: string): Promise<Team> {
        return mockTeam;
    }
    async createTeam(team: Team): Promise<Team> {
        return mockTeam;
    }
    async getPlayersOfTeam(teamId: number): Promise<PlayerTeam[]> {
        return [mockPlayerTeam, mockPlayerTeam2];
    }
    async addPlayerToTeam(playerId: number, teamId: number): Promise<PlayerTeam> {
        return mockPlayerTeam;
    }
    async removePlayerFromTeam(playerId: number, teamId: number): Promise<PlayerTeam> {
        return mockPlayerTeam;
    }
}

