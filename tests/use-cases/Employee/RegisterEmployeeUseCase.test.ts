import { RegisterEmployeeUseCase } from "../../../src/domain/usecases/Employee/RegisterEmployeeUseCase";
import { IEmployeeRepository } from "../../../src/domain/repositories/IEmployeeRepository";
import { Employee } from "../../../src/domain/entities/Employee";
import bcrypt from "bcrypt";
import { checkEmailExists } from "../../../src/shared/utils/EmailHelper";

jest.mock("../../../src/shared/utils/EmailHelper", () => ({
  checkEmailExists: jest.fn(),
}));

jest.mock("bcrypt");

describe("RegisterEmployeeUseCase", () => {
  let mockEmployeeRepository: jest.Mocked<IEmployeeRepository>;
  let registerEmployeeUseCase: RegisterEmployeeUseCase;

  beforeEach(() => {
    mockEmployeeRepository = {
      registerEmployee: jest.fn(),
      isEmailExists: jest.fn(),
      updateEmployee: jest.fn(),
      deleteEmployee: jest.fn(),
      getEmployee: jest.fn(),
      getAllBySupervisorId: jest.fn(),
      getAllEmployee: jest.fn(),
    } as jest.Mocked<IEmployeeRepository>;

    registerEmployeeUseCase = new RegisterEmployeeUseCase(
      mockEmployeeRepository
    );
  });

  it("should return an error if the email already exists", async () => {
    (checkEmailExists as jest.Mock).mockResolvedValue(true);

    const response = await registerEmployeeUseCase.execute(
      "John Doe",
      "john.doe@example.com",
      "password123",
      "companyId",
      "divisionId",
      "supervisorId"
    );

    expect(response.error).toBe(true);
    expect(response.message).toBe("Email already in use");
    expect(response.data).toBeNull();
  });

  it("should hash the password and register the employee successfully", async () => {
    (checkEmailExists as jest.Mock).mockResolvedValue(false);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    const mockEmployee = new Employee(
      "",
      "John Doe",
      "john.doe@example.com",
      "hashedPassword",
      "employee",
      "companyId",
      "divisionId",
      "supervisorId"
    );

    mockEmployeeRepository.registerEmployee.mockResolvedValue(mockEmployee);

    const response = await registerEmployeeUseCase.execute(
      "John Doe",
      "john.doe@example.com",
      "password123",
      "companyId",
      "divisionId",
      "supervisorId"
    );

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(mockEmployeeRepository.registerEmployee).toHaveBeenCalledWith(
      mockEmployee
    );
    expect(response.error).toBe(false);
    expect(response.message).toBe("Employee registered successfully");
    expect(response.data).toEqual(mockEmployee);
  });

  it("should handle errors during employee registration", async () => {
    (checkEmailExists as jest.Mock).mockResolvedValue(false);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    mockEmployeeRepository.registerEmployee.mockImplementation(() => {
      throw new Error("Database error");
    });

    try {
      await registerEmployeeUseCase.execute(
        "John Doe",
        "john.doe@example.com",
        "password123",
        "companyId",
        "divisionId",
        "supervisorId"
      );
    } catch (error: unknown) {
      const e = error as Error;
      expect(e.message).toBe("Database error");
    }
  });
});
