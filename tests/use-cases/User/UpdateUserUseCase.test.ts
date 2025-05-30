import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";
import { UpdateUserUseCase } from "../../../src/domain/usecases/User/UpdateUserUseCase";
import { User } from "../../../src/domain/entities/User";
import bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("updatePersonalUserUseCase", () => {
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let updatePersonalUserUseCase: UpdateUserUseCase;

  beforeEach(() => {
    mockUserRepository = {
      getPersonal: jest.fn(),
      updatePersonal: jest.fn(), 
      isEmailExists: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    updatePersonalUserUseCase = new UpdateUserUseCase(mockUserRepository);
  });

  it("should updatePersonal user details successfully", async () => {
    const existingUser: User = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword",
      role: "personal",
    };

    const updatePersonalData = {
      name: "Jane Doe",
      email: "jane@example.com",
    };

    const updatePersonaldUser: User = {
      ...existingUser,
      ...updatePersonalData,
    };

    mockUserRepository.getPersonal.mockResolvedValue(existingUser);
    mockUserRepository.isEmailExists.mockResolvedValue(false);
    mockUserRepository.updatePersonal.mockResolvedValue(updatePersonaldUser);

    const result = await updatePersonalUserUseCase.execute(
      "1",
      updatePersonalData
    );

    expect(mockUserRepository.getPersonal).toHaveBeenCalledWith("1");
    expect(mockUserRepository.updatePersonal).toHaveBeenCalledWith("1", {
      ...existingUser,
      ...updatePersonalData,
      password: existingUser.password,
    });
    expect(result).toEqual(updatePersonaldUser);
  });

  it("should hash the password if provided in updatePersonalData", async () => {
    const existingUser: User = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword",
      role: "personal",
    };

    const updatePersonalData = {
      password: "newpassword",
    };

    const hashedPassword = "newhashedpassword";
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const updatePersonaldUser: User = {
      ...existingUser,
      password: hashedPassword,
    };

    mockUserRepository.getPersonal.mockResolvedValue(existingUser);
    mockUserRepository.updatePersonal.mockResolvedValue(updatePersonaldUser);

    const result = await updatePersonalUserUseCase.execute(
      "1",
      updatePersonalData
    );

    expect(bcrypt.hash).toHaveBeenCalledWith("newpassword", 10);
    expect(mockUserRepository.updatePersonal).toHaveBeenCalledWith("1", {
      ...existingUser,
      password: hashedPassword,
    });
    expect(result).toEqual(updatePersonaldUser);
  });

  it("should throw an error if the user does not exist", async () => {
    mockUserRepository.getPersonal.mockResolvedValue(null);

    await expect(
      updatePersonalUserUseCase.execute("1", { name: "Jane Doe" })
    ).rejects.toThrow("User not found");

    expect(mockUserRepository.getPersonal).toHaveBeenCalledWith("1");
    expect(mockUserRepository.updatePersonal).not.toHaveBeenCalled();
  });

  it("should retain existing user data if no updatePersonalData is provided", async () => {
    const existingUser: User = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword",
      role: "personal",
    };

    mockUserRepository.getPersonal.mockResolvedValue(existingUser);
    mockUserRepository.updatePersonal.mockResolvedValue(existingUser);

    const result = await updatePersonalUserUseCase.execute("1", {});

    expect(mockUserRepository.getPersonal).toHaveBeenCalledWith("1");
    expect(mockUserRepository.updatePersonal).toHaveBeenCalledWith(
      "1",
      existingUser
    );
    expect(result).toEqual(existingUser);
  });
});
