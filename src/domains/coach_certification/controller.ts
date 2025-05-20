import { createCoachCertificationModel } from './model';
import { createCoachCertificationService } from './service';

const coachCertificationModel = createCoachCertificationModel();
const coachCertificationService = createCoachCertificationService(coachCertificationModel);

export { coachCertificationModel, coachCertificationService }; 