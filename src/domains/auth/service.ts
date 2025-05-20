import { User, UserType } from '@/domains/user/types';
import { UserModel } from '@/domains/user/model';
import { createUserModel } from '@/domains/user/model';

export class AuthService {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  async login(username: string, password: string): Promise<User & { userType: UserType }> {
    // In a real application, you would validate password here
    // This is a simplified version for the demo
    const user = await this.userModel.getUserByUsername(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, you'd verify password hash here
    // For demo, we'll just accept any password
    
    // Return user with userType (it's already part of the User interface)
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.getUserByUsername(username);
    return user;
  }
}

export function createAuthService(): AuthService {
  const userModel = createUserModel();
  return new AuthService(userModel);
} 