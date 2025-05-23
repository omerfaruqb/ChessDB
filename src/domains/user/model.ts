import { Player, User, UserType, Coach, Arbiter } from "./types";
import { Pool } from 'mysql2/promise';
import { getDatabase } from "../../shared/db";

export class UserModel {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  private async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const [rows] = await this.db.query(sql, params);
    return rows as T[];
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const rows = await this.query(
      `SELECT username, password, name, surname, nationality, user_type as userType FROM users WHERE username = ?`,
      [username]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    // Map user_type to userType enum
    const user = rows[0] as any;
    
    // Convert database enum string to UserType enum
    if (user.userType) {
      user.userType = user.userType as UserType;
    }
    
    return user as User;
  }

  async getPlayerByUsername(username: string): Promise<Player | null> {
    const rows = await this.query<any>(
      `SELECT 
        u.username, u.password, u.name, u.surname, u.nationality, u.user_type as userType,
        p.date_of_birth as dateOfBirth, p.elo_rating as eloRating, p.fide_id as fideId, p.title_id as titleId
       FROM users u 
       JOIN players p ON u.username = p.username 
       WHERE u.username = ? AND u.user_type = 'PLAYER'`,
      [username]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    const player = rows[0];
    return {
      ...player,
      userType: UserType.PLAYER
    } as Player;
  }

  async getCoachByUsername(username: string): Promise<Coach | null> {
    const rows = await this.query<any>(
      `SELECT 
        u.username, u.password, u.name, u.surname, u.nationality, u.user_type as userType
       FROM users u 
       JOIN coaches c ON u.username = c.username 
       WHERE u.username = ? AND u.user_type = 'COACH'`,
      [username]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    const coach = rows[0];
    return {
      ...coach,
      userType: UserType.COACH
    } as Coach;
  }

  async getArbiterByUsername(username: string): Promise<Arbiter | null> {
    const rows = await this.query<any>(
      `SELECT 
        u.username, u.password, u.name, u.surname, u.nationality, u.user_type as userType,
        a.experience_level as experienceLevel
       FROM users u 
       JOIN arbiters a ON u.username = a.username 
       WHERE u.username = ? AND u.user_type = 'ARBITER'`,
      [username]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    const arbiter = rows[0];
    return {
      ...arbiter,
      userType: UserType.ARBITER
    } as Arbiter;
  }

  async createUser(userData: Partial<User>): Promise<void> {
    const { username, password, name, surname, nationality, userType } = userData;
    
    if (!username || !password || !userType) {
      throw new Error('Username, password, and user type are required');
    }

    // Insert into users table
    await this.query(
      `INSERT INTO users (username, password, name, surname, nationality, user_type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, password, name, surname, nationality, userType]
    );
  }

  async createPlayer(playerData: Partial<Player>): Promise<void> {
    const { username, password, name, surname, nationality, dateOfBirth, eloRating, fideId, titleId } = playerData;
    
    if (!username || !password || !dateOfBirth || !eloRating || !fideId) {
      throw new Error('Username, password, date of birth, ELO rating, and FIDE ID are required for players');
    }

    // First create the user
    await this.createUser({
      username,
      password,
      name,
      surname,
      nationality,
      userType: UserType.PLAYER
    });

    // Then create the player-specific entry
    await this.query(
      `INSERT INTO players (username, date_of_birth, elo_rating, fide_id, title_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [username, dateOfBirth, eloRating, fideId, titleId]
    );
  }

  async createCoach(coachData: Partial<Coach>): Promise<void> {
    const { username, password, name, surname, nationality } = coachData;
    
    if (!username || !password) {
      throw new Error('Username and password are required for coaches');
    }

    // First create the user
    await this.createUser({
      username,
      password,
      name,
      surname,
      nationality,
      userType: UserType.COACH
    });

    // Then create the coach-specific entry
    await this.query(
      `INSERT INTO coaches (username) VALUES (?)`,
      [username]
    );
  }

  async createArbiter(arbiterData: Partial<Arbiter>): Promise<void> {
    const { username, password, name, surname, nationality, experienceLevel } = arbiterData;
    
    if (!username || !password || !experienceLevel) {
      throw new Error('Username, password, and experience level are required for arbiters');
    }

    // First create the user
    await this.createUser({
      username,
      password,
      name,
      surname,
      nationality,
      userType: UserType.ARBITER
    });

    // Then create the arbiter-specific entry
    await this.query(
      `INSERT INTO arbiters (username, experience_level) VALUES (?, ?)`,
      [username, experienceLevel]
    );
  }
}

export function createUserModel(): UserModel {
  const db = getDatabase();
  return new UserModel(db);
}
