import { createTeamModel } from './model';
import { createTeamService } from './service';

const teamModel = createTeamModel();
const teamService = createTeamService(teamModel);

export { teamModel, teamService }; 