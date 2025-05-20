import { createTitleModel } from './model';
import { createTitleService } from './service';

const titleModel = createTitleModel();
const titleService = createTitleService(titleModel);

export { titleService }; 