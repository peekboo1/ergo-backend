import { checkEmailExists } from "../../../shared/utils/EmailHelper";
import { IResponse } from "../../../shared/utils/IResponse";
import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";
import { Employee } from "../../entities/Employee";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/CreateResponse";
import bcrypt from "bcrypt";

export class RegisterEmployeeUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute(
    name: string,
    email: string,
    password: string,
    companyId: string,
    divisionId: string,
    supervisorId: string
  ): Promise<IResponse<Employee>> {
    if (
      !name?.trim() ||
      !email?.trim() ||
      !password?.trim() ||
      !companyId?.trim() ||
      !divisionId?.trim() ||
      !supervisorId?.trim()
    ) {
      return errorResponse("All fields are required");
    }

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return errorResponse("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new Employee(
      "",
      name,
      email,
      hashedPassword,
      "employee",
      companyId,
      divisionId,
      supervisorId
    );

    const newEmployee = await this.employeeRepository.registerEmployee(
      employee
    );

    return successResponse(
      "Employee registered successfully",
      newEmployee,
      200
    );
  }
}
