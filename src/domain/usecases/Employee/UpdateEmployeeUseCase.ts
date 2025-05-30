import bcrypt from "bcrypt";
import { Employee } from "../../entities/Employee";
import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";

export class UpdateEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute(id: string, data: Partial<Employee>): Promise<Employee> {
    const existing = await this.employeeRepository.getEmployee(id);
    if (!existing) throw new Error("Employee not found");

    if (data.email && data.email !== existing.email) {
      const isTaken = await this.employeeRepository.isEmailExists(data.email);
      if (isTaken) throw new Error("Email already in use");
    }

    const password = data.password
      ? await bcrypt.hash(data.password, 10)
      : existing.password;

    const updatedEmployee = new Employee(
      existing.id,
      data.name ?? existing.name,
      data.email ?? existing.email,
      password,
      "employee",
      existing.companyId,
      existing.divisionId,
      existing.supervisorId
    );

    return await this.employeeRepository.updateEmployee(id, updatedEmployee);
  }
}
