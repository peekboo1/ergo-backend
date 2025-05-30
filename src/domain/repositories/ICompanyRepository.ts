import { Company } from "../entities/Company";

export interface ICompanyRepository {
  createCompany(company: Company): Promise<Company>;
  updateCompany(id: string, company: Partial<Company>): Promise<Company>;
  getCompany(id: string): Promise<Company | null>;
  getAllCompany(): Promise<Company[]>;
}
