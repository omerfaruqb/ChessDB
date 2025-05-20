import { Player, User, UserType, Coach, Arbiter } from "./types";
import { Pool } from 'mysql2';
import { getDatabase } from "../../shared/db";

// const mockUser: User = {
//   username: "testuser",
//   password: "testpassword",
//   name: "Test",
//   surname: "User",
//   nationality: "Testland",
//   userType: UserType.PLAYER,
// };

// const mockPlayer: Player = {
//   ...mockUser,
//   userType: UserType.PLAYER,
//   dateOfBirth: new Date("1990-01-01"),
//   eloRating: 1500,
//   fideId: "1234567890",
//   titleId: 1,
// };

// const mockCoach: Coach = {
//   ...mockUser,
//   userType: UserType.COACH,
// };

// const mockArbiter: Arbiter = {
//   ...mockUser,
//   userType: UserType.ARBITER,
//   experienceLevel: "Expert",
// };

export class UserModel {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  private query<T>(sql: string, params: any[] = []): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results as any);
        }
      });
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [rows] = await this.query<any[][]>(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    return rows[0] as User | null;
  }

  async getPlayerByUsername(username: string): Promise<Player | null> {
    const [rows] = await this.query<any[][]>(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    return rows[0] as Player | null;
  }

  async getCoachByUsername(username: string): Promise<Coach | null> {
    const [rows] = await this.query<any[][]>(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    return rows[0] as Coach | null;
  }

  async getArbiterByUsername(username: string): Promise<Arbiter | null> {
    const [rows] = await this.query<any[][]>(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    return rows[0] as Arbiter | null;
  }
}

export function createUserModel(): UserModel {
  const db = getDatabase();
  return new UserModel(db);
}
