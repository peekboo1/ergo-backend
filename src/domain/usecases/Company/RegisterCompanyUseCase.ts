import { ICompanyRepository } from "../../repositories/ICompanyRepository";
import { Company } from "../../entities/Company";
import { IResponse } from "../../../shared/utils/IResponse";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/CreateResponse";
import validator from "validator";

export class RegisterCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(
    name: string,
    phone: string,
    address: string,
    email: string,
    website: string
  ): Promise<IResponse<Company>> {
    if (!name || !phone || !email) {
      return errorResponse("Name, phone, and email are required", 400);
    }

    if (!validator.isEmail(email)) {
      return errorResponse("Invalid email format", 400);
    }

    try {
      const company = new Company("", name, phone, address, email, website);
      const newCompany = await this.companyRepository.createCompany(company);
      return successResponse(
        "Company registered successfully",
        newCompany,
        201
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return errorResponse(message, 500);
    }
  }
}
