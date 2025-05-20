import { createUserModel } from './model';
import { createUserService } from './service';

const userModel = createUserModel();
const userService = createUserService(userModel);

export { userModel, userService }; 