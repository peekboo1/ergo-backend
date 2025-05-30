import { GetEmployeeUseCase } from "../../../src/domain/usecases/Employee/GetEmployeeUseCase";
import { IEmployeeRepository } from "../../../src/domain/repositories/IEmployeeRepository";
import { Employee } from "../../../src/domain/entities/Employee";

describe("GetEmployeeUseCase", () => {
  let getEmployeeUseCase: GetEmployeeUseCase;
  let employeeRepository: IEmployeeRepository;

  beforeEach(() => {
    employeeRepository = {
      isEmailExists: jest.fn(),
      registerEmployee: jest.fn(),
      updateEmployee: jest.fn(),
      deleteEmployee: jest.fn(),
      getEmployee: jest.fn(),
      getAllBySupervisorId: jest.fn(),
      getAllEmployee: jest.fn(),
    } as unknown as IEmployeeRepository;
    getEmployeeUseCase = new GetEmployeeUseCase(employeeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const employeeId = "123";
    const employeeData = new Employee(
      "123",
      "Jane Doe",
      "janedoe@example.com",
      "hashedPassword",
      "employee",
      "company-1",
      "division-1",
      "supervisor-1"
    );

    it("should return employee when found", async () => {
      (employeeRepository.getEmployee as jest.Mock).mockResolvedValue(
        employeeData
      );

      const result = await getEmployeeUseCase.execute(employeeId);

      expect(result).toEqual(employeeData);
      expect(employeeRepository.getEmployee).toHaveBeenCalledWith(employeeId);
    });

    it("should throw an error when employee is not found", async () => {
      (employeeRepository.getEmployee as jest.Mock).mockResolvedValue(null);

      await expect(getEmployeeUseCase.execute(employeeId)).rejects.toThrow(
        "Employee not found"
      );
      expect(employeeRepository.getEmployee).toHaveBeenCalledWith(employeeId);
    });

    it("should handle errors gracefully", async () => {
      const errorMessage = "Database connection error";
      (employeeRepository.getEmployee as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(getEmployeeUseCase.execute(employeeId)).rejects.toThrow(
        errorMessage
      );
      expect(employeeRepository.getEmployee).toHaveBeenCalledWith(employeeId);
    });
  });
});
