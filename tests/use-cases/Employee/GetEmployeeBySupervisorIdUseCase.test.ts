import { IEmployeeRepository } from "../../../src/domain/repositories/IEmployeeRepository";
import { GetEmployeeBySupervisorIdUseCase } from "../../../src/domain/usecases/Employee/GetEmployeeBySupervisorId";

describe("GetEmployeeBySupervisorIdUseCase", () => {
  let getEmployeeBySupervisorIdUseCase: GetEmployeeBySupervisorIdUseCase;
  let employeeRepository: IEmployeeRepository;

  beforeEach(() => {
    employeeRepository = {
      getAllBySupervisorId: jest.fn(),
    } as unknown as IEmployeeRepository;
    getEmployeeBySupervisorIdUseCase = new GetEmployeeBySupervisorIdUseCase(
      employeeRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    const supervisorId = "supervisor-123";
    const employeeData = [
      {
        id: "1",
        name: "John Doe",
        email: "johndoe@example.com",
        divisionName: "Engineering",
        companyName: "TechCorp",
      },
      {
        id: "2",
        name: "Alice Smith",
        email: "alicesmith@example.com",
        divisionName: "Marketing",
        companyName: "TechCorp",
      },
    ];

    it("should return employees when supervisor has employees", async () => {
      // Arrange: Mock the repository's getAllBySupervisorId function to return employee data
      (employeeRepository.getAllBySupervisorId as jest.Mock).mockResolvedValue(
        employeeData
      );

      // Act: Execute the use case
      const result = await getEmployeeBySupervisorIdUseCase.execute(
        supervisorId
      );

      // Assert: The result should be the transformed employee data
      expect(result).toEqual([
        {
          id: "1",
          name: "John Doe",
          email: "johndoe@example.com",
          divisionName: "Engineering",
          companyName: "TechCorp",
        },
        {
          id: "2",
          name: "Alice Smith",
          email: "alicesmith@example.com",
          divisionName: "Marketing",
          companyName: "TechCorp",
        },
      ]);
      expect(employeeRepository.getAllBySupervisorId).toHaveBeenCalledWith(
        supervisorId
      );
    });

    it("should return an empty array when supervisor has no employees", async () => {
      (employeeRepository.getAllBySupervisorId as jest.Mock).mockResolvedValue(
        []
      );

      const result = await getEmployeeBySupervisorIdUseCase.execute(
        supervisorId
      );

      expect(result).toEqual([]);
      expect(employeeRepository.getAllBySupervisorId).toHaveBeenCalledWith(
        supervisorId
      );
    });

    it("should handle errors gracefully", async () => {
      const errorMessage = "Database connection error";
      (employeeRepository.getAllBySupervisorId as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        getEmployeeBySupervisorIdUseCase.execute(supervisorId)
      ).rejects.toThrow(errorMessage);
      expect(employeeRepository.getAllBySupervisorId).toHaveBeenCalledWith(
        supervisorId
      );
    });
  });
});
