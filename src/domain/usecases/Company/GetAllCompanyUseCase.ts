import { ICompanyRepository } from "../../repositories/ICompanyRepository";
import { IResponse } from "../../../shared/utils/IResponse";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/CreateResponse";

export class GetAllCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(): Promise<IResponse<{ id: string; name: string }[]>> {
    try {
      const companies = await this.companyRepository.getAllCompany();

      if (!companies.length) {
        return errorResponse("No companies found", 404);
      }

      const result = companies.map((company) => ({
        id: company.id,
        name: company.name,
      }));

      return successResponse("Companies retrieved successfully", result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to retrieve companies";
      return errorResponse(message, 500);
    }
  }
}
