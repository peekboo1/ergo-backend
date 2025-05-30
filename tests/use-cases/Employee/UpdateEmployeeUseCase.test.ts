import { Employee } from "../../../src/domain/entities/Employee";
import { IEmployeeRepository } from "../../../src/domain/repositories/IEmployeeRepository";
import { UpdateEmployeeUseCase } from "../../../src/domain/usecases/Employee/UpdateEmployeeUseCase";
import bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("UpdateEmployeeUseCase", () => {
  let mockEmployeeRepository: jest.Mocked<IEmployeeRepository>;
  let updateEmployeeUseCase: UpdateEmployeeUseCase;

  beforeEach(() => {
    mockEmployeeRepository = {
      isEmailExists: jest.fn(),
      registerEmployee: jest.fn(),
      updateEmployee: jest.fn(),
      deleteEmployee: jest.fn(),
      getEmployee: jest.fn(),
      getAllBySupervisorId: jest.fn(),
      getAllEmployee: jest.fn(),
    } as unknown as jest.Mocked<IEmployeeRepository>;

    updateEmployeeUseCase = new UpdateEmployeeUseCase(mockEmployeeRepository);
  });

  it("should throw an error if the employee does not exist", async () => {
    mockEmployeeRepository.getEmployee.mockResolvedValue(null);

    await expect(
      updateEmployeeUseCase.execute("nonexistent-id", { name: "John Doe" })
    ).rejects.toThrow("Employee not found");
  });

  it("should throw an error if the email is already in use", async () => {
    const existingEmployee: Employee = {
      id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
      password: "hashedpassword",
      role: "employee",
      companyId: "company1",
      divisionId: "division1",
      supervisorId: "supervisor1",
    };

    mockEmployeeRepository.getEmployee.mockResolvedValue(existingEmployee);
    mockEmployeeRepository.isEmailExists.mockResolvedValue(true);

    await expect(
      updateEmployeeUseCase.execute("1", { email: "newemail@example.com" })
    ).rejects.toThrow("Email already in use");
  });

  it("should hash the password if a new password is provided", async () => {
    const existingEmployee: Employee = {
      id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
      password: "hashedpassword",
      role: "employee",
      companyId: "company1",
      divisionId: "division1",
      supervisorId: "supervisor1",
    };

    const newPassword = "newpassword";
    const hashedPassword = "newhashedpassword";

    mockEmployeeRepository.getEmployee.mockResolvedValue(existingEmployee);
    mockEmployeeRepository.isEmailExists.mockResolvedValue(false);
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const updatedEmployee: Employee = {
      ...existingEmployee,
      password: hashedPassword,
    };

    mockEmployeeRepository.updateEmployee.mockResolvedValue(updatedEmployee);

    const result = await updateEmployeeUseCase.execute("1", {
      password: newPassword,
    });

    expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
    expect(result.password).toBe(hashedPassword);
  });

  it("should update the employee with the provided data", async () => {
    const existingEmployee: Employee = {
      id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
      password: "hashedpassword",
      role: "employee",
      companyId: "company1",
      divisionId: "division1",
      supervisorId: "supervisor1",
    };

    const updateData: Partial<Employee> = {
      name: "John Doe",
      email: "john@example.com",
    };

    const updatedEmployee: Employee = {
      ...existingEmployee,
      ...updateData,
    };

    mockEmployeeRepository.getEmployee.mockResolvedValue(existingEmployee);
    mockEmployeeRepository.isEmailExists.mockResolvedValue(false);
    mockEmployeeRepository.updateEmployee.mockResolvedValue(updatedEmployee);

    const result = await updateEmployeeUseCase.execute("1", updateData);

    expect(result.name).toBe(updateData.name);
    expect(result.email).toBe(updateData.email);
  });

  it("should retain unchanged fields if not provided in updateData", async () => {
    const existingEmployee: Employee = {
      id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
      password: "hashedpassword",
      role: "employee",
      companyId: "company1",
      divisionId: "division1",
      supervisorId: "supervisor1",
    };

    const updateData: Partial<Employee> = {
      name: "John Doe",
    };

    const updatedEmployee: Employee = {
      ...existingEmployee,
      ...updateData,
    };

    mockEmployeeRepository.getEmployee.mockResolvedValue(existingEmployee);
    mockEmployeeRepository.isEmailExists.mockResolvedValue(false);
    mockEmployeeRepository.updateEmployee.mockResolvedValue(updatedEmployee);

    const result = await updateEmployeeUseCase.execute("1", updateData);

    expect(result.name).toBe(updateData.name);
    expect(result.email).toBe(existingEmployee.email);
  });
});
