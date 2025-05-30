import { User } from "../entities/User";

export interface IUserRepository {
  isEmailExists(email: string): Promise<boolean>;
  createPersonal(user: User): Promise<User>;
  updatePersonal(id: string, user: User | Partial<User>): Promise<User>;
  deletePersonal(id: string): Promise<void>;
  getPersonal(id: string): Promise<User | null>;
  getAllPersonal(): Promise<User[]>;
}
