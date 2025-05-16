import { UserType } from "@/domains/user/types";
import { User } from "@/domains/user/types";
import {
  UserService,
  createUserService,
} from "../../user/services/userService";
import jwt from "jsonwebtoken";

// JWT token payload
const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface JwtPayload {
  username: string;
  userType: UserType;
}



/**
 * Authentication service for handling user login, registration, and session management
 */
export class AuthService {
  constructor(private userService: UserService) {
    this.userService = userService;
  }
  /**
   * Log in a user with their credentials
   * @param username User's username
   * @param password User's password
   * @returns JWT token, containing username, and userType
   */
  async login(username: string, password: string): Promise<string> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.password !== password) {
      // @TODO: hash password
      throw new Error("Invalid password");
    }
    
    // Generate JWT token
    const payload = {
      username: user.username,
      userType: user.userType,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
    return token;
  }
}

export default new AuthService(createUserService());
