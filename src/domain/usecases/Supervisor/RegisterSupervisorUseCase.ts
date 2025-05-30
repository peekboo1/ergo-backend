import { ISupervisorRepository } from "../../repositories/ISupervisorRepository";
import { Supervisor } from "../../entities/Supervisor";
import { IResponse } from "../../../shared/utils/IResponse";
import { successResponse } from "../../../shared/utils/CreateResponse";
import bcrypt from "bcrypt";

export class RegisterSupervisorUseCase {
  constructor(private supervisorRepository: ISupervisorRepository) {}

  async execute(
    name: string,
    email: string,
    password: string,
    companyId: string
  ): Promise<IResponse<Supervisor>> {
    if (!name || !email || !password || !companyId) {
      return { error: true, message: "All fields are required", data: null };
    }

    const emailExists = await this.supervisorRepository.isEmailExists(email);
    if (emailExists) {
      return { error: true, message: "Email already in use", data: null };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const supervisor = new Supervisor(
      "",
      name,
      email,
      hashedPassword,
      "supervisor",
      companyId
    );

    try {
      const createdSupervisor =
        await this.supervisorRepository.createSupervisor(supervisor);
      return successResponse(
        "Supervisor registered successfully",
        createdSupervisor,
        201
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Registration failed: ${message}`);
    }
  }
}
