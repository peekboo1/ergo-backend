import { RegisterSupervisorUseCase } from "../../../src/domain/usecases/Supervisor/RegisterSupervisorUseCase";
import { ISupervisorRepository } from "../../../src/domain/repositories/ISupervisorRepository";
import { Supervisor } from "../../../src/domain/entities/Supervisor";
import bcrypt from "bcrypt";
jest.mock("bcrypt");

describe("RegisterSupervisorUseCase", () => {
  let mockSupervisorRepository: jest.Mocked<ISupervisorRepository>;
  let registerSupervisorUseCase: RegisterSupervisorUseCase;

  beforeEach(() => {
    mockSupervisorRepository = {
      isEmailExists: jest.fn(),
      createSupervisor: jest.fn(),
      getSupervisor: jest.fn(),
      updateSupervisor: jest.fn(),
      deleteSupervisor: jest.fn(),
      getAllSupervisors: jest.fn(),
    };
    registerSupervisorUseCase = new RegisterSupervisorUseCase(
      mockSupervisorRepository
    );
  });

  it("should return an error if any required field is missing", async () => {
    const response = await registerSupervisorUseCase.execute(
      "",
      "test@example.com",
      "password",
      "companyId"
    );
    expect(response).toEqual({
      error: true,
      message: "All fields are required",
      data: null,
    });
  });

  it("should return an error if the email already exists", async () => {
    mockSupervisorRepository.isEmailExists.mockResolvedValue(true);

    const response = await registerSupervisorUseCase.execute(
      "John Doe",
      "test@example.com",
      "password",
      "companyId"
    );
    expect(response).toEqual({
      error: true,
      message: "Email already in use",
      data: null,
    });
    expect(mockSupervisorRepository.isEmailExists).toHaveBeenCalledWith(
      "test@example.com"
    );
  });

  it("should hash the password and create a supervisor successfully", async () => {
    mockSupervisorRepository.isEmailExists.mockResolvedValue(false);
    mockSupervisorRepository.createSupervisor.mockResolvedValue(
      new Supervisor(
        "1",
        "John Doe",
        "test@example.com",
        "hashedPassword",
        "supervisor",
        "companyId"
      )
    );
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    const response = await registerSupervisorUseCase.execute(
      "John Doe",
      "test@example.com",
      "password",
      "companyId"
    );

    expect(response).toEqual({
      error: false,
      message: "Supervisor registered successfully",
      data: expect.objectContaining({
        id: "1",
        name: "John Doe",
        email: "test@example.com",
        password: "hashedPassword",
        role: "supervisor",
        companyId: "companyId",
      }),
      statusCode: 201,
    });
    expect(mockSupervisorRepository.isEmailExists).toHaveBeenCalledWith(
      "test@example.com"
    );
    expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
    expect(mockSupervisorRepository.createSupervisor).toHaveBeenCalled();
  });

  it("should return an error if an exception occurs", async () => {
    mockSupervisorRepository.isEmailExists.mockRejectedValue(
      new Error("Database error")
    );

    await expect(
      registerSupervisorUseCase.execute(
        "John Doe",
        "test@example.com",
        "password",
        "companyId"
      )
    ).rejects.toThrow("Database error");

    expect(mockSupervisorRepository.isEmailExists).toHaveBeenCalledWith(
      "test@example.com"
    );
  });
});
