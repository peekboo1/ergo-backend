import { Supervisor } from "../../entities/Supervisor";
import { ISupervisorRepository } from "../../repositories/ISupervisorRepository";
import bcrypt from "bcrypt";

export class UpdateSupervisorUseCase {
  constructor(private supervisorRepository: ISupervisorRepository) {}

  async execute(
    id: string,
    updateData: Partial<Supervisor>
  ): Promise<Supervisor> {
    const existingSupervisor = await this.supervisorRepository.getSupervisor(
      id
    );
    if (!existingSupervisor) {
      const error: any = new Error("Supervisor not found");
      error.statusCode = 404;
      throw error;
    }

    if (updateData.email && updateData.email !== existingSupervisor.email) {
      const emailTaken = await this.supervisorRepository.isEmailExists(
        updateData.email
      );
      if (emailTaken) {
        const error: any = new Error("Email already in use");
        error.statusCode = 400;
        throw error;
      }
    }

    let hashedPassword = existingSupervisor.password;
    if (updateData.password) {
      hashedPassword = await bcrypt.hash(updateData.password, 10);
    }

    const supervisorToUpdate: Supervisor = {
      id: existingSupervisor.id,
      name: updateData.name || existingSupervisor.name,
      email: updateData.email || existingSupervisor.email,
      password: hashedPassword,
    };

    const updatedSupervisor = await this.supervisorRepository.updateSupervisor(
      id,
      supervisorToUpdate
    );
    return updatedSupervisor;
  }
}
