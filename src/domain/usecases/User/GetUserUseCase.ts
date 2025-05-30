import { IUserRepository } from "../../repositories/IUserRepository";
import { User } from "../../entities/User";

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.getPersonal(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
