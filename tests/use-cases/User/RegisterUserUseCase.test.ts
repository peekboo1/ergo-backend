import { RegisterUserUseCase } from "../../../src/domain/usecases/User/RegisterUserUseCase";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";
import { User } from "../../../src/domain/entities/User";
import bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("RegisterUserUseCase", () => {
  let userRepository: IUserRepository;
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    userRepository = {
      isEmailExists: jest.fn(),
      createPersonal: jest.fn(),
    } as unknown as IUserRepository;

    registerUserUseCase = new RegisterUserUseCase(userRepository);
  });

  it("should return an error if the email already exists", async () => {
    (userRepository.isEmailExists as jest.Mock).mockResolvedValue(true);

    const response = await registerUserUseCase.execute(
      "John Doe",
      "john@example.com",
      "password123"
    );

    expect(response.error).toBe(true);
    expect(response.message).toBe("Email already in use");
    expect(response.data).toBeNull();
    expect(userRepository.isEmailExists).toHaveBeenCalledWith(
      "john@example.com"
    );
  });

  it("should hash the password and create a new user", async () => {
    (userRepository.isEmailExists as jest.Mock).mockResolvedValue(false);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    const mockUser = new User(
      "",
      "John Doe",
      "john@example.com",
      "hashedPassword",
      "personal"
    );
    (userRepository.createPersonal as jest.Mock).mockResolvedValue(mockUser);

    const response = await registerUserUseCase.execute(
      "John Doe",
      "john@example.com",
      "password123"
    );

    expect(response.error).toBe(false);
    expect(response.message).toBe("User registered successfully");
    expect(response.data).toEqual(mockUser);
    expect(userRepository.isEmailExists).toHaveBeenCalledWith(
      "john@example.com"
    );
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(userRepository.createPersonal).toHaveBeenCalledWith(mockUser);
  });

  it("should throw an error if an exception occurs", async () => {
    (userRepository.isEmailExists as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await expect(
      registerUserUseCase.execute("John Doe", "john@example.com", "password123")
    ).rejects.toThrow("Database error");
  });

  it("should throw a generic error if an unknown error occurs", async () => {
    (userRepository.isEmailExists as jest.Mock).mockRejectedValue(
      "Unknown error"
    );

    await expect(
      registerUserUseCase.execute("John Doe", "john@example.com", "password123")
    ).rejects.toThrow("An unknown error occurred");
  });
});
