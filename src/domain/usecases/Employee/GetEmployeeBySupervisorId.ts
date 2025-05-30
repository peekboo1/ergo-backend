import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";

export class GetEmployeeBySupervisorIdUseCase {
  constructor(private repo: IEmployeeRepository) {}

  async execute(supervisorId: string) {
    const employees = await this.repo.getAllBySupervisorId(supervisorId);
    return employees.map(({ id, name, email, divisionName, companyName }) => ({
      id,
      name,
      email,
      divisionName,
      companyName,
    }));
  }
}
