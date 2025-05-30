import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { ApplicationError } from "../../../shared/errors/ApplicationError";
import { Company } from "../../../domain/entities/Company";
import { CompanyModel } from "../models/CompanyModels";

export class CompanyRepository implements ICompanyRepository {
  async createCompany(company: Company): Promise<Company> {
    try {
      const newCompany = await CompanyModel.create({
        name: company.name,
        phone: company.phone,
        address: company.address,
        email: company.email,
        website: company.website,
      });

      return Company.fromModel(newCompany);
    } catch (error) {
      throw new Error("Failed to create company");
    }
  }

  async updateCompany(id: string, company: Partial<Company>): Promise<Company> {
    try {
      const [updatedCount] = await CompanyModel.update(
        {
          name: company.name,
          phone: company.phone,
          address: company.address,
          email: company.email,
          website: company.website,
        },
        { where: { id } }
      );

      if (updatedCount === 0) {
        throw new Error("Company not found or no changes made");
      }

      const companyData = await CompanyModel.findOne({ where: { id } });
      if (!companyData) {
        throw new Error("Company not found after update");
      }

      return Company.fromModel(companyData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error updating company";
      throw new Error(message);
    }
  }

  async getCompany(id: string): Promise<Company | null> {
    try {
      const company = await CompanyModel.findOne({ where: { id } });
      return company ? Company.fromModel(company) : null;
    } catch {
      throw new Error("Failed to fetch company");
    }
  }

  async getAllCompany(): Promise<Company[]> {
    try {
      const companies = await CompanyModel.findAll();
      return companies.map(
        (company) =>
          new Company(
            company.id,
            company.name,
            company.phone,
            company.address,
            company.email,
            company.website
          )
      );
    } catch (error) {
      throw new Error("Failed to fetch all companies");
    }
  }
}
