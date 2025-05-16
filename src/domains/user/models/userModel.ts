import { Player, User, UserType, Coach, Arbiter } from "../types";

const mockUser: User = {
  username: "testuser",
  password: "testpassword",
  name: "Test",
  surname: "User",
  nationality: "Testland",
  userType: UserType.PLAYER,
};

const mockPlayer: Player = {
  ...mockUser,
  userType: UserType.PLAYER,
  dateOfBirth: new Date("1990-01-01"),
  eloRating: 1500,
  fideId: "1234567890",
  titleId: 1,
};

const mockCoach: Coach = {
  ...mockUser,
  userType: UserType.COACH,
};

const mockArbiter: Arbiter = {
  ...mockUser,
  userType: UserType.ARBITER,
  experienceLevel: "Expert",
};
export class UserModel {
  async getUserByUsername(username: string): Promise<User | null> {
    return mockUser;
  }

  async getPlayerByUsername(username: string): Promise<Player | null> {
    return mockPlayer;
  }

  async getCoachByUsername(username: string): Promise<Coach | null> {
    return mockCoach;
  }

  async getArbiterByUsername(username: string): Promise<Arbiter | null> {
    return mockArbiter;
  }
}

export function createUserModel(): UserModel {
  return new UserModel();
}
