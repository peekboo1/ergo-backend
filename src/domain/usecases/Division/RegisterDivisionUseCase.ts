import { IDivisionRepository } from "../../repositories/IDivisionRepository";
import { Division } from "../../entities/Division";
import { IResponse } from "../../../shared/utils/IResponse";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/CreateResponse";

export class RegisterDivisionUseCase {
  constructor(private divisionRepository: IDivisionRepository) {}

  async execute(name: string, companyId: string): Promise<IResponse<Division>> {
    if (!name || !companyId) {
      return errorResponse("Name, and Company ID are required", 400);
    }

    try {
      const division = new Division("", name, companyId);
      const newDivision = await this.divisionRepository.createDivision(
        division
      );

      return successResponse(
        "Company registered successfully",
        newDivision,
        201
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Registration failed: ${message}`);
    }
  }
}
