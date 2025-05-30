import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";
import { Employee } from "../../entities/Employee";

export class GetAllEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute(): Promise<Employee[]> {
    const employees = await this.employeeRepository.getAllEmployee();

    if (!employees || employees.length === 0) {
      const error: any = new Error("Employee not found");
      error.statusCode = 404;
      throw error;
    }

    return employees;
  }
}
