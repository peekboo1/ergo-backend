import { IDivisionRepository } from "../../repositories/IDivisionRepository";

export class GetAllDivisionUseCase {
  constructor(private divisionRepository: IDivisionRepository) {}

  async execute(companyId: string) {
    const divisions = await this.divisionRepository.getAllDivision(companyId);

    if (!divisions || divisions.length === 0) {
      const error: any = new Error("Division not found");
      error.statusCode = 404;
      throw error;
    }

    return divisions.map(({ id, name }) => ({ id, name }));
  }
}
