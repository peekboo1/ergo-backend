import { ISupervisorRepository } from "../../repositories/ISupervisorRepository";
import { Supervisor } from "../../entities/Supervisor";

export class GetAllSupervisorUseCase {
  constructor(private supervisorRepository: ISupervisorRepository) {}

  async execute(): Promise<Supervisor[]> {
    const supervisors = await this.supervisorRepository.getAllSupervisors();

    if (!supervisors || supervisors.length === 0) {
      const error: any = new Error("Supervisor not found");
      error.statusCode = 404;
      throw error;
    }

    return supervisors;
  }
}
