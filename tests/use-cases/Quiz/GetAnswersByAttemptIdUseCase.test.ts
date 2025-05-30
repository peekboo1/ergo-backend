import { GetAnswersByAttemptIdUseCase } from "../../../src/domain/usecases/Quiz/GetAnswersByAttemptIdUseCase";
import { UserAnswerRepository } from "../../../src/infrastructure/db/repositories/UserAnswerRepository"; // Adjust path if needed
import { UserAnswer } from "../../../src/domain/entities/UserAnswer";

// Ensure that the mock path matches the actual file location
jest.mock("../../../src/infrastructure/db/repositories/UserAnswerRepository");

describe("GetAnswersByAttemptIdUseCase", () => {
  let userAnswerRepo: jest.Mocked<UserAnswerRepository>;
  let getAnswersByAttemptIdUseCase: GetAnswersByAttemptIdUseCase;

  beforeEach(() => {
    // Initialize the mock repository
    userAnswerRepo =
      new UserAnswerRepository() as jest.Mocked<UserAnswerRepository>;

    // Initialize the use case with the mock repository
    getAnswersByAttemptIdUseCase = new GetAnswersByAttemptIdUseCase(
      userAnswerRepo
    );
  });

  it("should return a list of answers by attemptId", async () => {
    // Mock data
    const mockAnswers = [
      new UserAnswer("1", "attempt1", "user1", "option1"),
      new UserAnswer("2", "attempt1", "user2", "option2"),
    ];

    // Mock the repository method
    userAnswerRepo.getAnswersByAttemptId.mockResolvedValue(mockAnswers);

    // Call the use case execute method
    const result = await getAnswersByAttemptIdUseCase.execute("attempt1");

    // Validate the result
    expect(result).toEqual(mockAnswers);
    expect(userAnswerRepo.getAnswersByAttemptId).toHaveBeenCalledWith(
      "attempt1"
    );
    expect(userAnswerRepo.getAnswersByAttemptId).toHaveBeenCalledTimes(1);
  });

  it("should return an empty array when no answers found", async () => {
    // Mock the repository method to return an empty array
    userAnswerRepo.getAnswersByAttemptId.mockResolvedValue([]);

    // Call the use case execute method
    const result = await getAnswersByAttemptIdUseCase.execute("attempt2");

    // Validate the result
    expect(result).toEqual([]);
    expect(userAnswerRepo.getAnswersByAttemptId).toHaveBeenCalledWith(
      "attempt2"
    );
    expect(userAnswerRepo.getAnswersByAttemptId).toHaveBeenCalledTimes(1);
  });

  it("should handle errors thrown by the repository", async () => {
    // Mock the repository method to reject with an error
    userAnswerRepo.getAnswersByAttemptId.mockRejectedValue(
      new Error("Database error")
    );

    // Validate that the error is handled properly
    await expect(
      getAnswersByAttemptIdUseCase.execute("attempt1")
    ).rejects.toThrow("Database error");
    expect(userAnswerRepo.getAnswersByAttemptId).toHaveBeenCalledWith(
      "attempt1"
    );
  });
});
