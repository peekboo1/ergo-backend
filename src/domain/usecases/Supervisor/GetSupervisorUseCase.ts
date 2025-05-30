import { ISupervisorRepository } from "../../repositories/ISupervisorRepository";
import { Supervisor } from "../../entities/Supervisor";

export class GetSupervisorUseCase {
  constructor(private supervisorRepository: ISupervisorRepository) {}

  async execute(id: string): Promise<Supervisor> {
    const supervisor = await this.supervisorRepository.getSupervisor(id);

    if (!supervisor) {
      throw new Error("Supervisor not found");
    }

    return supervisor;
  }
}
