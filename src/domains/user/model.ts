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
    const rows = await this.query<User>(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    return rows[0] ?? null;
  }

  async getPlayerByUsername(username: string): Promise<Player | null> {
    const rows = await this.query<Player>(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    return rows[0] ?? null;
  }

  async getCoachByUsername(username: string): Promise<Coach | null> {
    const rows = await this.query<Coach>(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    return rows[0] ?? null;
  }

  async getArbiterByUsername(username: string): Promise<Arbiter | null> {
    const rows = await this.query<Arbiter>(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    return rows[0] ?? null;
  }
}

export function createUserModel(): UserModel {
  const db = getDatabase();
  return new UserModel(db);
}
