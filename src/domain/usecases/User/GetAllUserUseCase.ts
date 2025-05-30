import { IUserRepository } from "../../repositories/IUserRepository";
import { User } from "../../entities/User";

export class GetAllUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    const users = await this.userRepository.getAllPersonal();
    if (!users || users.length === 0) {
      throw new Error("No users found");
    }
    return users;
  }
}
