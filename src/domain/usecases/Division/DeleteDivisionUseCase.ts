import { IDivisionRepository } from "../../repositories/IDivisionRepository";

export class DeleteDivisionUseCase {
  constructor(private divisionRepository: IDivisionRepository) {}

  async execute(id: string): Promise<void> {
    const supervisor = await this.divisionRepository.getDivision(id);

    if (!supervisor) {
      throw new Error("Division not found");
    }

    await this.divisionRepository.deleteDivision(id);
  }
}
