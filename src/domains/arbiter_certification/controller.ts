import { createArbiterCertificationModel } from './model';
import {  createArbiterCertificationService } from './service';

const arbiterCertificationModel = createArbiterCertificationModel();
const arbiterCertificationService = createArbiterCertificationService(arbiterCertificationModel);
export { arbiterCertificationModel, arbiterCertificationService }; 