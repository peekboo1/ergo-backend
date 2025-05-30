import { User } from "../../entities/User";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IResponse } from "../../../shared/utils/IResponse";
import bcrypt from "bcrypt";

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    name: string,
    email: string,
    password: string
  ): Promise<IResponse<User>> {
    try {
      const trimmedName = name?.trim();
      const trimmedEmail = email?.trim().toLowerCase();
      const trimmedPassword = password?.trim();

      if (!trimmedName || !trimmedEmail || !trimmedPassword) {
        return {
          error: true,
          message:
            "Missing required fields: name, email, and password are required",
          data: null,
          statusCode: 400,
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return {
          error: true,
          message: "Invalid email format",
          data: null,
          statusCode: 400,
        };
      }

      const emailExists = await this.userRepository.isEmailExists(trimmedEmail);
      if (emailExists) {
        return {
          error: true,
          message: "Email already in use",
          data: null,
          statusCode: 400,
        };
      }

      const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
      const newUser = await this.userRepository.createPersonal(
        new User("", trimmedName, trimmedEmail, hashedPassword, "personal")
      );

      return {
        error: false,
        message: "User registered successfully",
        data: newUser,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
}
