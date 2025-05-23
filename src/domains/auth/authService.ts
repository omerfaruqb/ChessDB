import { UserType } from "@/domains/user/types";
import { userService } from "@/domains/user/controller";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// JWT token payload
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

interface JwtPayload {
  username: string;
  userType: UserType;
}

/**
 * Authentication service for handling user login, registration, and session management
 */
export class AuthService {
  constructor() {
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

  /**
   * Validate password strength
   * @param password Password to validate
   * @returns True if password meets requirements
   */
  validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Log in a user with their credentials
   * @param username User's username
   * @param password User's password
   * @returns JWT token, containing username, and userType
   */
  async login(username: string, password: string): Promise<string> {
    const user = await userService.getUserByUsername(username);
    if (!user) {
      throw new Error("Invalid username or password");
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
      throw new Error("Invalid username or password");
    }
    
    // Generate JWT token
    const payload: JwtPayload = {
      username: user.username,
      userType: user.userType,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
    return token;
  }

  /**
   * Verify JWT token
   * @param token JWT token
   * @returns Decoded token payload
   */
  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}

export function createAuthService(): AuthService {
  return new AuthService();
}

