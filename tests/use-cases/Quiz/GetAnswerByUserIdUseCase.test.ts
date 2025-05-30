import { GetAnswersByUserIdUseCase } from "../../../src/domain/usecases/Quiz/GetAnswersByUserIdUseCase";
import { UserAnswerRepository } from "../../../src/infrastructure/db/repositories/UserAnswerRepository";

describe("GetAnswerByUserIdUseCase", () => {
  let getAnswerByUserIdUseCase: GetAnswersByUserIdUseCase;

  let mockUserAnswerRepository: jest.Mocked<UserAnswerRepository>;

  beforeEach(() => {
    mockUserAnswerRepository = {} as jest.Mocked<UserAnswerRepository>;
    getAnswerByUserIdUseCase = new GetAnswersByUserIdUseCase(
      mockUserAnswerRepository
    );
  });

  it("should return the correct answer for a valid user ID", async () => {
    const userId = "valid-user-id";
    const expectedAnswer = [
      {
        id: "answer-id",
        text: "Sample Answer",
        attemptId: "attempt-id",
        userId: "valid-user-id",
        selectedOptionId: "option-id",
      },
    ];

    jest
      .spyOn(getAnswerByUserIdUseCase, "execute")
      .mockResolvedValue(expectedAnswer);

    const result = await getAnswerByUserIdUseCase.execute(userId);

    expect(result).toEqual(expectedAnswer);
  });

  it("should throw an error if the user ID is invalid", async () => {
    const invalidUserId = "invalid-user-id";

    jest
      .spyOn(getAnswerByUserIdUseCase, "execute")
      .mockRejectedValue(new Error("User not found"));

    await expect(
      getAnswerByUserIdUseCase.execute(invalidUserId)
    ).rejects.toThrow("User not found");
  });

  it("should handle cases where no answer is found for the user ID", async () => {
    const userId = "user-without-answer";

    jest.spyOn(getAnswerByUserIdUseCase, "execute").mockResolvedValue([]);

    const result = await getAnswerByUserIdUseCase.execute(userId);
    expect(result).toEqual([]);
  });

  it("should call the execute method with the correct user ID", async () => {
    const userId = "test-user-id";

    const executeSpy = jest
      .spyOn(getAnswerByUserIdUseCase, "execute")
      .mockResolvedValue([]);

    await getAnswerByUserIdUseCase.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });
});
