import { ISupervisorRepository } from "../../repositories/ISupervisorRepository";

export class DeleteSupervisorUseCase {
  constructor(private supervisorRepository: ISupervisorRepository) {}

  async execute(id: string): Promise<void> {
    const supervisor = await this.supervisorRepository.getSupervisor(id);

    if (!supervisor) {
      throw new Error("Supervisor not found");
    }

    await this.supervisorRepository.deleteSupervisor(id);
  }
}
