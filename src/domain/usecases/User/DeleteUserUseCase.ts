import { IUserRepository } from "../../repositories/IUserRepository";

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    await this.userRepository.deletePersonal(id);
  }
}
