import { Company } from "../../entities/Company";
import { ICompanyRepository } from "../../repositories/ICompanyRepository";
import { IResponse } from "../../../shared/utils/IResponse";
import {
  errorResponse,
  successResponse,
} from "../../../shared/utils/CreateResponse";

export class UpdateCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(
    id: string,
    updateData: Partial<Company>
  ): Promise<IResponse<Company>> {
    try {
      const existingCompany = await this.companyRepository.getCompany(id);
      if (!existingCompany) {
        return errorResponse("Company not found", 404);
      }

      const updatedData: Partial<Company> = {
        name: updateData.name ?? existingCompany.name,
        phone: updateData.phone ?? existingCompany.phone,
        address: updateData.address ?? existingCompany.address,
        email: updateData.email ?? existingCompany.email,
        website: updateData.website ?? existingCompany.website,
      };

      const updatedCompany = await this.companyRepository.updateCompany(
        id,
        updatedData
      );
      return successResponse("Company updated successfully", updatedCompany);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update company";
      return errorResponse(message, 500);
    }
  }
}
