import { GetSupervisorUseCase } from "../../../src/domain/usecases/Supervisor/GetSupervisorUseCase";
import { ISupervisorRepository } from "../../../src/domain/repositories/ISupervisorRepository";
import { Supervisor } from "../../../src/domain/entities/Supervisor";

describe("GetSupervisorUseCase", () => {
  let mockSupervisorRepository: jest.Mocked<ISupervisorRepository>;
  let getSupervisorUseCase: GetSupervisorUseCase;

  beforeEach(() => {
    mockSupervisorRepository = {
      isEmailExists: jest.fn(),
      createSupervisor: jest.fn(),
      getSupervisor: jest.fn(),
      updateSupervisor: jest.fn(),
      deleteSupervisor: jest.fn(),
      getAllSupervisors: jest.fn(),
    };
    getSupervisorUseCase = new GetSupervisorUseCase(mockSupervisorRepository);
  });

  it("should return a supervisor when found", async () => {
    const mockSupervisor: Supervisor = {
      id: "1",
      name: "John Doe",
      email: "",
      password: "",
    };
    mockSupervisorRepository.getSupervisor.mockResolvedValue(mockSupervisor);

    const result = await getSupervisorUseCase.execute("1");

    expect(mockSupervisorRepository.getSupervisor).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockSupervisor);
  });

  it("should throw an error when supervisor is not found", async () => {
    mockSupervisorRepository.getSupervisor.mockResolvedValue(null);

    await expect(getSupervisorUseCase.execute("1")).rejects.toThrow(
      "Supervisor not found"
    );
    expect(mockSupervisorRepository.getSupervisor).toHaveBeenCalledWith("1");
  });

  it("should throw an error when repository throws an error", async () => {
    mockSupervisorRepository.getSupervisor.mockRejectedValue(
      new Error("Database error")
    );

    await expect(getSupervisorUseCase.execute("1")).rejects.toThrow(
      "Database error"
    );
    expect(mockSupervisorRepository.getSupervisor).toHaveBeenCalledWith("1");
  });
});
