import { GetUserUseCase } from "../../../src/domain/usecases/User/GetUserUseCase";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";
import { User } from "../../../src/domain/entities/User";

describe("GetUserUseCase", () => {
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let getUserUseCase: GetUserUseCase;

  beforeEach(() => {
    mockUserRepository = {
      getPersonal: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    getUserUseCase = new GetUserUseCase(mockUserRepository);
  });

  it("should return a user when the user exists", async () => {
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: "",
      password: "",
      role: "personal",
    };
    mockUserRepository.getPersonal.mockResolvedValue(mockUser);

    const result = await getUserUseCase.execute("1");

    expect(mockUserRepository.getPersonal).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockUser);
  });

  it("should throw an error when the user does not exist", async () => {
    mockUserRepository.getPersonal.mockResolvedValue(null);

    await expect(getUserUseCase.execute("1")).rejects.toThrow("User not found");
    expect(mockUserRepository.getPersonal).toHaveBeenCalledWith("1");
  });

  it("should throw an error if the repository throws an error", async () => {
    mockUserRepository.getPersonal.mockRejectedValue(
      new Error("Database error")
    );

    await expect(getUserUseCase.execute("1")).rejects.toThrow("Database error");
    expect(mockUserRepository.getPersonal).toHaveBeenCalledWith("1");
  });
});
