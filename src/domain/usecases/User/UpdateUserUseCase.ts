import { User } from "../../entities/User";
import { IUserRepository } from "../../repositories/IUserRepository";
import bcrypt from "bcrypt";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, updateData: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.getPersonal(id);
    if (!existingUser) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (
      updateData.email &&
      updateData.email !== existingUser.email &&
      (await this.userRepository.isEmailExists(updateData.email))
    ) {
      const error: any = new Error("Email already in use");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = updateData.password
      ? await bcrypt.hash(updateData.password, 10)
      : existingUser.password;

    const updatedUser = await this.userRepository.updatePersonal(id, {
      ...existingUser,
      ...updateData,
      password: hashedPassword,
      role: "personal",
    });

    return updatedUser;
  }
}
