import { DeleteUserUseCase } from "../../../src/domain/usecases/User/DeleteUserUseCase";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";

describe("DeleteUserUseCase", () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      deletePersonal: jest.fn(),
      getPersonal: jest.fn(),
      isEmailExists: jest.fn(),
      createPersonal: jest.fn(),
      updatePersonal: jest.fn(),
      getAllPersonal: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
  });

  it("should call deletePersonal with the correct id", async () => {
    const userId = "123";

    await deleteUserUseCase.execute(userId);

    expect(mockUserRepository.deletePersonal).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.deletePersonal).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if deletePersonal fails", async () => {
    const userId = "123";
    mockUserRepository.deletePersonal.mockRejectedValue(
      new Error("Delete failed")
    );

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      "Delete failed"
    );
  });

  it("should not throw an error if deletePersonal succeeds", async () => {
    const userId = "123";
    mockUserRepository.deletePersonal.mockResolvedValue();

    await expect(deleteUserUseCase.execute(userId)).resolves.not.toThrow();
  });
});
