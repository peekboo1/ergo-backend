import { UpdateSupervisorUseCase } from "../../../src/domain/usecases/Supervisor/UpdateSupervisorUseCase";
import { ISupervisorRepository } from "../../../src/domain/repositories/ISupervisorRepository";
import { Supervisor } from "../../../src/domain/entities/Supervisor";
import bcrypt from "bcrypt";
jest.mock("bcrypt");

describe("UpdateSupervisorUseCase", () => {
  let mockSupervisorRepository: jest.Mocked<ISupervisorRepository>;
  let updateSupervisorUseCase: UpdateSupervisorUseCase;

  beforeEach(() => {
    mockSupervisorRepository = {
      getSupervisor: jest.fn(),
      updateSupervisor: jest.fn(),
      isEmailExists: jest.fn(),
    } as unknown as jest.Mocked<ISupervisorRepository>;

    updateSupervisorUseCase = new UpdateSupervisorUseCase(
      mockSupervisorRepository
    );
  });

  it("should update supervisor details successfully", async () => {
    const existingSupervisor: Supervisor = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedpassword",
    };

    const updateData = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
    };

    mockSupervisorRepository.getSupervisor.mockResolvedValue(
      existingSupervisor
    );
    mockSupervisorRepository.updateSupervisor.mockResolvedValue({
      ...existingSupervisor,
      ...updateData,
    });

    const result = await updateSupervisorUseCase.execute("1", updateData);

    expect(mockSupervisorRepository.getSupervisor).toHaveBeenCalledWith("1");
    expect(mockSupervisorRepository.updateSupervisor).toHaveBeenCalledWith(
      "1",
      {
        ...existingSupervisor,
        ...updateData,
        password: existingSupervisor.password,
      }
    );
    expect(result).toEqual({
      ...existingSupervisor,
      ...updateData,
    });
  });

  it("should hash the password if provided in updateData", async () => {
    const existingSupervisor: Supervisor = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedpassword",
    };

    const updateData = {
      password: "newpassword",
    };

    const hashedPassword = "newhashedpassword";
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    mockSupervisorRepository.getSupervisor.mockResolvedValue(
      existingSupervisor
    );
    mockSupervisorRepository.updateSupervisor.mockResolvedValue({
      ...existingSupervisor,
      password: hashedPassword,
    });

    const result = await updateSupervisorUseCase.execute("1", updateData);

    expect(bcrypt.hash).toHaveBeenCalledWith("newpassword", 10);
    expect(mockSupervisorRepository.updateSupervisor).toHaveBeenCalledWith(
      "1",
      {
        ...existingSupervisor,
        password: hashedPassword,
      }
    );
    expect(result).toEqual({
      ...existingSupervisor,
      password: hashedPassword,
    });
  });

  it("should throw an error if supervisor is not found", async () => {
    mockSupervisorRepository.getSupervisor.mockResolvedValue(null);

    await expect(
      updateSupervisorUseCase.execute("1", { name: "Jane Doe" })
    ).rejects.toThrow("Supervisor not found");

    expect(mockSupervisorRepository.getSupervisor).toHaveBeenCalledWith("1");
    expect(mockSupervisorRepository.updateSupervisor).not.toHaveBeenCalled();
  });

  it("should not update fields that are not provided in updateData", async () => {
    const existingSupervisor: Supervisor = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedpassword",
    };

    const updateData = {};

    mockSupervisorRepository.getSupervisor.mockResolvedValue(
      existingSupervisor
    );
    mockSupervisorRepository.updateSupervisor.mockResolvedValue(
      existingSupervisor
    );

    const result = await updateSupervisorUseCase.execute("1", updateData);

    expect(mockSupervisorRepository.getSupervisor).toHaveBeenCalledWith("1");
    expect(mockSupervisorRepository.updateSupervisor).toHaveBeenCalledWith(
      "1",
      existingSupervisor
    );
    expect(result).toEqual(existingSupervisor);
  });
});
