import { DeleteEmployeeUseCase } from "../../../src/domain/usecases/Employee/DeleteEmployeeUseCase";
import { IEmployeeRepository } from "../../../src/domain/repositories/IEmployeeRepository";

describe("DeleteEmployeeUseCase", () => {
  let deleteEmployeeUseCase: DeleteEmployeeUseCase;
  let mockEmployeeRepository: jest.Mocked<IEmployeeRepository>;

  beforeEach(() => {
    mockEmployeeRepository = {
      getEmployee: jest.fn(),
      deleteEmployee: jest.fn(),
    } as unknown as jest.Mocked<IEmployeeRepository>;
    deleteEmployeeUseCase = new DeleteEmployeeUseCase(mockEmployeeRepository);
  });

  it("should delete an employee if they exist", async () => {
    const employeeId = "123";
    mockEmployeeRepository.getEmployee.mockResolvedValueOnce({
      id: employeeId,
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedpassword",
      role: "employee",
      companyId: "company123",
      divisionId: "division123",
      supervisorId: "supervisor123",
    });

    await deleteEmployeeUseCase.execute(employeeId);

    expect(mockEmployeeRepository.getEmployee).toHaveBeenCalledWith(employeeId);
    expect(mockEmployeeRepository.deleteEmployee).toHaveBeenCalledWith(
      employeeId
    );
  });

  it("should throw an error if the employee does not exist", async () => {
    const employeeId = "123";
    mockEmployeeRepository.getEmployee.mockResolvedValueOnce(null);

    await expect(deleteEmployeeUseCase.execute(employeeId)).rejects.toThrow(
      "Employee not found"
    );

    expect(mockEmployeeRepository.getEmployee).toHaveBeenCalledWith(employeeId);
    expect(mockEmployeeRepository.deleteEmployee).not.toHaveBeenCalled();
  });

  it("should handle repository errors when checking for employee existence", async () => {
    const employeeId = "123";
    mockEmployeeRepository.getEmployee.mockRejectedValueOnce(
      new Error("Repository error")
    );

    await expect(deleteEmployeeUseCase.execute(employeeId)).rejects.toThrow(
      "Repository error"
    );

    expect(mockEmployeeRepository.getEmployee).toHaveBeenCalledWith(employeeId);
    expect(mockEmployeeRepository.deleteEmployee).not.toHaveBeenCalled();
  });

  it("should handle repository errors when deleting an employee", async () => {
    const employeeId = "123";
    mockEmployeeRepository.getEmployee.mockResolvedValueOnce({
      id: employeeId,
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedpassword",
      role: "employee",
      companyId: "company123",
      divisionId: "division123",
      supervisorId: "supervisor123",
    });
    mockEmployeeRepository.deleteEmployee.mockRejectedValueOnce(
      new Error("Repository error")
    );

    await expect(deleteEmployeeUseCase.execute(employeeId)).rejects.toThrow(
      "Repository error"
    );

    expect(mockEmployeeRepository.getEmployee).toHaveBeenCalledWith(employeeId);
    expect(mockEmployeeRepository.deleteEmployee).toHaveBeenCalledWith(
      employeeId
    );
  });
});
