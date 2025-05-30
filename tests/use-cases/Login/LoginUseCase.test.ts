import { LoginUseCase } from "../../../src/domain/usecases/Auth/LoginUseCase";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";
import { ISupervisorRepository } from "../../../src/domain/repositories/ISupervisorRepository";
import { IEmployeeRepository } from "../../../src/domain/repositories/IEmployeeRepository";
import { comparePassword } from "../../../src/shared/utils/PasswordUtils";
import { createToken } from "../../../src/shared/utils/JwtUtils";
import { UserModel } from "../../../src/infrastructure/db/models/UserModels";
import { SupervisorModel } from "../../../src/infrastructure/db/models/SupervisorModels";
import { EmployeeModel } from "../../../src/infrastructure/db/models/EmployeeModels";

jest.mock("../../../src/shared/utils/PasswordUtils");
jest.mock("../../../src/shared/utils/JwtUtils");

describe("LoginUseCase", () => {
  let userRepository: IUserRepository;
  let supervisorRepository: ISupervisorRepository;
  let employeeRepository: IEmployeeRepository;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    userRepository = {} as IUserRepository;
    supervisorRepository = {} as ISupervisorRepository;
    employeeRepository = {} as IEmployeeRepository;

    loginUseCase = new LoginUseCase(
      userRepository,
      supervisorRepository,
      employeeRepository
    );
  });

  it("should return an error if email is not found", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue(null);
    jest.spyOn(SupervisorModel, "findOne").mockResolvedValue(null);
    jest.spyOn(EmployeeModel, "findOne").mockResolvedValue(null);

    const response = await loginUseCase.execute("test@example.com", "password");

    expect(response).toEqual({
      error: true,
      message: "Email not found",
      data: null,
    });
  });

  it("should return an error if password is invalid", async () => {
    const mockUser = { id: 1, email: "test@example.com", password: "hashedPassword", role: "user" };
    jest.spyOn(UserModel, "findOne").mockResolvedValue(mockUser as any);
    (comparePassword as jest.Mock).mockResolvedValue(false);

    const response = await loginUseCase.execute("test@example.com", "wrongPassword");

    expect(response).toEqual({
      error: true,
      message: "Invalid email or password",
      data: null,
    });
  });

  it("should return a token and user data if login is successful", async () => {
    const mockUser = { id: 1, email: "test@example.com", password: "hashedPassword", role: "user", name: "Test User" };
    jest.spyOn(UserModel, "findOne").mockResolvedValue(mockUser as any);
    (comparePassword as jest.Mock).mockResolvedValue(true);
    (createToken as jest.Mock).mockReturnValue("mockToken");

    const response = await loginUseCase.execute("test@example.com", "password");

    expect(response).toEqual({
      error: false,
      message: "Login successful",
      data: {
        token: "mockToken",
        name: "Test User",
        email: "test@example.com",
        role: "user",
      },
    });
  });

  it("should handle errors during execution", async () => {
    jest.spyOn(UserModel, "findOne").mockRejectedValue(new Error("Database error"));

    const response = await loginUseCase.execute("test@example.com", "password");

    expect(response).toEqual({
      error: true,
      message: "Database error",
      data: null,
    });
  });
});