import { CalculateScoreUseCase } from "../../../src/domain/usecases/QuizAttempt/CalculateScoreUseCase";
import { IUserAnswerRepository } from "../../../src/domain/repositories/IUserAnswerRepository";
import { IQuizAttemptRepository } from "../../../src/domain/repositories/IQuizAttemptRepository";
import { IQuestionRepository } from "../../../src/domain/repositories/IQuestionRepository";
import { UserAnswer } from "../../../src/domain/entities/UserAnswer";

describe("CalculateScoreUseCase", () => {
  let userAnswerRepository: jest.Mocked<IUserAnswerRepository>;
  let attemptRepository: jest.Mocked<IQuizAttemptRepository>;
  let questionRepository: jest.Mocked<IQuestionRepository>;
  let calculateScoreUseCase: CalculateScoreUseCase;

  beforeEach(() => {
    userAnswerRepository = {
      getAnswersByAttemptId: jest.fn(),
    } as unknown as jest.Mocked<IUserAnswerRepository>;

    attemptRepository = {
      updateScore: jest.fn(),
    } as unknown as jest.Mocked<IQuizAttemptRepository>;

    questionRepository = {
      getQuestionCountByAttempt: jest.fn(),
    } as unknown as jest.Mocked<IQuestionRepository>;

    calculateScoreUseCase = new CalculateScoreUseCase(
      userAnswerRepository,
      attemptRepository,
      questionRepository
    );
  });

  it("should calculate the correct score and update the attempt", async () => {
    const attemptId = "attempt1";
    const userAnswers: UserAnswer[] = [
      { isCorrect: true } as UserAnswer,
      { isCorrect: false } as UserAnswer,
      { isCorrect: true } as UserAnswer,
    ];
    const totalQuestions = 3;

    userAnswerRepository.getAnswersByAttemptId.mockResolvedValue(userAnswers);
    questionRepository.getQuestionCountByAttempt.mockResolvedValue(
      totalQuestions
    );

    const score = await calculateScoreUseCase.execute(attemptId);

    expect(score).toBe(67); 
    expect(attemptRepository.updateScore).toHaveBeenCalledWith(attemptId, 67);
  });

  it("should throw an error if not all questions are answered", async () => {
    const attemptId = "attempt2";
    const userAnswers: UserAnswer[] = [{ isCorrect: true } as UserAnswer];
    const totalQuestions = 3;

    userAnswerRepository.getAnswersByAttemptId.mockResolvedValue(userAnswers);
    questionRepository.getQuestionCountByAttempt.mockResolvedValue(
      totalQuestions
    );

    await expect(calculateScoreUseCase.execute(attemptId)).rejects.toThrow(
      "You haven't answered all the questions yet."
    );
  });

  it("should throw an error if retrieving answers fails", async () => {
    const attemptId = "attempt3";

    userAnswerRepository.getAnswersByAttemptId.mockRejectedValue(
      new Error("Database error")
    );

    await expect(calculateScoreUseCase.execute(attemptId)).rejects.toThrow(
      "Failed to retrieve answers: Database error"
    );
  });

  it("should throw an error if retrieving answers fails with an unknown error", async () => {
    const attemptId = "attempt4";

    userAnswerRepository.getAnswersByAttemptId.mockRejectedValue(
      "Unknown error"
    );

    await expect(calculateScoreUseCase.execute(attemptId)).rejects.toThrow(
      "Failed to retrieve answers due to an unknown error."
    );
  });

  it("should handle a perfect score correctly", async () => {
    const attemptId = "attempt5";
    const userAnswers: UserAnswer[] = [
      { isCorrect: true } as UserAnswer,
      { isCorrect: true } as UserAnswer,
      { isCorrect: true } as UserAnswer,
    ];
    const totalQuestions = 3;

    userAnswerRepository.getAnswersByAttemptId.mockResolvedValue(userAnswers);
    questionRepository.getQuestionCountByAttempt.mockResolvedValue(
      totalQuestions
    );

    const score = await calculateScoreUseCase.execute(attemptId);

    expect(score).toBe(100);
    expect(attemptRepository.updateScore).toHaveBeenCalledWith(attemptId, 100);
  });

  it("should handle a zero score correctly", async () => {
    const attemptId = "attempt6";
    const userAnswers: UserAnswer[] = [
      { isCorrect: false } as UserAnswer,
      { isCorrect: false } as UserAnswer,
      { isCorrect: false } as UserAnswer,
    ];
    const totalQuestions = 3;

    userAnswerRepository.getAnswersByAttemptId.mockResolvedValue(userAnswers);
    questionRepository.getQuestionCountByAttempt.mockResolvedValue(
      totalQuestions
    );

    const score = await calculateScoreUseCase.execute(attemptId);

    expect(score).toBe(0);
    expect(attemptRepository.updateScore).toHaveBeenCalledWith(attemptId, 0);
  });
});
