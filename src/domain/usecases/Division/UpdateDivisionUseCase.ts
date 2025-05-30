import { Division } from "../../entities/Division";
import { IDivisionRepository } from "../../repositories/IDivisionRepository";

export class UpdateDivisionUseCase {
  constructor(private divisionRepository: IDivisionRepository) {}

  async execute(id: string, updateData: Partial<Division>): Promise<Division> {
    const existingDivision = await this.divisionRepository.readDivision(id);

    if (!existingDivision) {
      throw new Error("Division not found");
    }

    const updatedDivision = new Division(
      id,
      updateData.name || existingDivision.name,
      existingDivision.companyId
    );

    const result = await this.divisionRepository.updateDivision(
      id,
      updatedDivision
    );

    if (!result) {
      throw new Error("Failed to update division");
    }

    return result;
  }
}