import { DeleteSupervisorUseCase } from "../../../src/domain/usecases/Supervisor/DeleteSupervisorUseCase";
import { ISupervisorRepository } from "../../../src/domain/repositories/ISupervisorRepository";

describe("DeleteSupervisorUseCase", () => {
  let deleteSupervisorUseCase: DeleteSupervisorUseCase;
  let mockSupervisorRepository: jest.Mocked<ISupervisorRepository>;

  beforeEach(() => {
    mockSupervisorRepository = {
      deleteSupervisor: jest.fn(),
      getSupervisor: jest
        .fn()
        .mockResolvedValue({ id: "123", name: "Test Supervisor" }), 
    } as unknown as jest.Mocked<ISupervisorRepository>;

    deleteSupervisorUseCase = new DeleteSupervisorUseCase(
      mockSupervisorRepository
    );
  });

  it("should call deleteSupervisor with the correct id", async () => {
    const supervisorId = "123";

    await deleteSupervisorUseCase.execute(supervisorId);

    expect(mockSupervisorRepository.getSupervisor).toHaveBeenCalledWith(
      supervisorId
    );
    expect(mockSupervisorRepository.deleteSupervisor).toHaveBeenCalledWith(
      supervisorId
    );
    expect(mockSupervisorRepository.deleteSupervisor).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if deleteSupervisor fails", async () => {
    const supervisorId = "123";
    mockSupervisorRepository.deleteSupervisor.mockRejectedValue(
      new Error("Delete failed")
    );

    await expect(deleteSupervisorUseCase.execute(supervisorId)).rejects.toThrow(
      "Delete failed"
    );

    expect(mockSupervisorRepository.deleteSupervisor).toHaveBeenCalledWith(
      supervisorId
    );
  });

  it("should throw an error if supervisor is not found", async () => {
    const supervisorId = "123";

    mockSupervisorRepository.getSupervisor.mockResolvedValue(null);

    await expect(deleteSupervisorUseCase.execute(supervisorId)).rejects.toThrow(
      "Supervisor not found"
    );
  });
});
