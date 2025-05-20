import { createMatchModel } from './model';
import { createMatchService } from './service';

const matchModel = createMatchModel();
const matchService = createMatchService(matchModel);

export { matchService }; 