import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";

export class DeleteEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.employeeRepository.getEmployee(id);
    if (!exists) throw new Error("Employee not found");

    await this.employeeRepository.deleteEmployee(id);
  }
}
