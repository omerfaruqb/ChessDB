import { User, UserType } from '@/domains/user/types';
import { UserModel } from '@/domains/user/model';
import { createUserModel } from '@/domains/user/model';
import bcrypt from 'bcrypt';

export class AuthService {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  /**
   * Hash a password using bcrypt
   * @param password Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify a password against its hash
   * @param password Plain text password
   * @param hash Hashed password from database
   * @returns True if password matches
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async login(username: string, password: string): Promise<User & { userType: UserType }> {
    const user = await this.userModel.getUserByUsername(username);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // For existing users with plain text passwords (backwards compatibility)
    // In production, all passwords should be hashed
    let isValidPassword = false;
    
    if (user.password.startsWith('$2b$')) {
      // Password is already hashed
      isValidPassword = await this.verifyPassword(password, user.password);
    } else {
      // Plain text password (for backwards compatibility with existing data)
      isValidPassword = user.password === password;
    }

    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }
    
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