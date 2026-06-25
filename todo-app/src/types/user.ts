export interface IUser {
  id: number;
  email: string;
  name: string;
}

export interface UserSettings {
  language: string;
  notificationsEnabled: boolean;
}

export interface StoredUserState {
  user: IUser | null;
  token: string | null;
  settings: UserSettings;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: IUser;
}
