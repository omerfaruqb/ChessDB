import { Player, User, Coach, Arbiter } from '@/domains/user/types'
import { UserModel, createUserModel } from '../models/userModel'

/**
 * Service for managing user accounts and profiles
 */
export class UserService {

  constructor(private userModel: UserModel) {
    this.userModel = userModel || createUserModel();
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userModel.getUserByUsername(username);
  }

  async getPlayerByUsername(username: string): Promise<Player | null> {
    return this.userModel.getPlayerByUsername(username);
  }

  async getCoachByUsername(username: string): Promise<Coach | null> {
    return this.userModel.getCoachByUsername(username);
  }

  async getArbiterByUsername(username: string): Promise<Arbiter | null> {
    return this.userModel.getArbiterByUsername(username);
  }
}

export function createUserService(): UserService {
  return new UserService(createUserModel());
}
