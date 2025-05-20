import { createSponsorModel } from './model';
import { createSponsorService } from './service';

const sponsorModel = createSponsorModel();
const sponsorService = createSponsorService(sponsorModel);

export { sponsorModel, sponsorService }; 