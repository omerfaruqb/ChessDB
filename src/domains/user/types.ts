export enum UserType {
  PLAYER = "PLAYER",
  COACH = "COACH",
  ARBITER = "ARBITER",
  MANAGER = "MANAGER",
}

export interface User {
  username: string; // unique id
  password: string;
  name: string;
  surname: string;
  nationality: string;
  userType: UserType;
}

export interface Player extends User {
  userType: UserType.PLAYER;
  dateOfBirth: Date;
  eloRating: number;
  fideId: string;
  titleId: number;
}

export interface Coach extends User {
  userType: UserType.COACH;
}

export interface Arbiter extends User {
  userType: UserType.ARBITER;
  experienceLevel: string;
}

export interface Manager {
  username: string;
  password: string;
  userType: UserType.MANAGER;
}
