import { StartQuizUseCase } from "../../../src/domain/usecases/QuizAttempt/StartQuizUseCase";
import { IQuizAttemptRepository } from "../../../src/domain/repositories/IQuizAttemptRepository";
import { QuizAttempt } from "../../../src/domain/entities/QuizAttempt";

jest.mock("../../../src/domain/repositories/IQuizAttemptRepository");

describe("StartQuizUseCase", () => {
  let quizAttemptRepository: jest.Mocked<IQuizAttemptRepository>;
  let startQuizUseCase: StartQuizUseCase;

  beforeEach(() => {
    quizAttemptRepository = {
      startAttempt: jest.fn(),
    } as unknown as jest.Mocked<IQuizAttemptRepository>;

    startQuizUseCase = new StartQuizUseCase(quizAttemptRepository);
  });

  it("should throw an error if userId or quizId is not provided", async () => {
    await expect(startQuizUseCase.execute("", "quiz1")).rejects.toThrow(
      "Quiz ID and question text are required"
    );
    await expect(startQuizUseCase.execute("user1", "")).rejects.toThrow(
      "Quiz ID and question text are required"
    );
    await expect(startQuizUseCase.execute("", "")).rejects.toThrow(
      "Quiz ID and question text are required"
    );
  });

  it("should call the repository to start an attempt with valid userId and quizId", async () => {
    const mockAttempt = new QuizAttempt("attempt1", "quiz1", "user1");

    quizAttemptRepository.startAttempt.mockResolvedValue(mockAttempt);
    const result = await startQuizUseCase.execute("user1", "quiz1");

    expect(quizAttemptRepository.startAttempt).toHaveBeenCalledWith(
      "user1",
      "quiz1"
    );
    expect(result).toEqual(mockAttempt);
  });

  it("should throw an error if repository throws an error", async () => {
    quizAttemptRepository.startAttempt.mockRejectedValue(
      new Error("Database error")
    );

    await expect(startQuizUseCase.execute("user1", "quiz1")).rejects.toThrow(
      "Database error"
    );
  });
});
