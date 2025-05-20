import { createHallModel } from './model';
import { createHallService } from './service';

const hallModel = createHallModel();
const hallService = createHallService(hallModel);

export { hallModel, hallService }; 