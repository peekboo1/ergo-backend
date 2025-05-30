import { SubmitAnswerUseCase } from "../../../src/domain/usecases/QuizAttempt/SubmitAnswerUseCase";
import { IUserAnswerRepository } from "../../../src/domain/repositories/IUserAnswerRepository";
import { IQuestionRepository } from "../../../src/domain/repositories/IQuestionRepository";
import { IOptionRepository } from "../../../src/domain/repositories/IOptionRepository";
import { CalculateScoreUseCase } from "../../../src/domain/usecases/QuizAttempt/CalculateScoreUseCase";
import { UserAnswer } from "../../../src/domain/entities/UserAnswer";

describe("SubmitAnswerUseCase", () => {
  let submitAnswerUseCase: SubmitAnswerUseCase;
  let mockUserAnswerRepository: jest.Mocked<IUserAnswerRepository>;
  let mockQuestionRepository: jest.Mocked<IQuestionRepository>;
  let mockOptionRepository: jest.Mocked<IOptionRepository>;
  let mockCalculateScoreUseCase: jest.Mocked<CalculateScoreUseCase>;

  beforeEach(() => {
    mockUserAnswerRepository = {
      submitAnswer: jest.fn(),
      getAnswersByAttempt: jest.fn(),
    } as unknown as jest.Mocked<IUserAnswerRepository>;

    mockQuestionRepository = {
      getQuestionById: jest.fn(),
      getQuestionCountByAttempt: jest.fn(),
    } as unknown as jest.Mocked<IQuestionRepository>;

    mockOptionRepository = {
      getOptionById: jest.fn(),
    } as unknown as jest.Mocked<IOptionRepository>;

    mockCalculateScoreUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CalculateScoreUseCase>;

    submitAnswerUseCase = new SubmitAnswerUseCase(
      mockUserAnswerRepository,
      mockCalculateScoreUseCase,
      mockQuestionRepository,
      mockOptionRepository
    );
  });

  it("should return an error if required fields are missing", async () => {
    const response = await submitAnswerUseCase.execute("", "", "", "");
    expect(response).toEqual({
      error: true,
      message: "All fields are required",
      data: null,
    });
  });

  it("should return an error if the question is not found", async () => {
    mockQuestionRepository.getQuestionById.mockResolvedValue(null);

    const response = await submitAnswerUseCase.execute(
      "user1",
      "attempt1",
      "question1",
      "option1"
    );

    expect(response).toEqual({
      error: true,
      message: "Question not found",
      data: null,
      statusCode: 404,
    });
  });

  it("should return an error if the option is not found", async () => {
    mockQuestionRepository.getQuestionById.mockResolvedValue({
      id: "question1",
      question: "Sample question",
      quizId: "quiz1",
    });
    mockOptionRepository.getOptionById.mockResolvedValue(null);

    const response = await submitAnswerUseCase.execute(
      "user1",
      "attempt1",
      "question1",
      "option1"
    );

    expect(response).toEqual({
      error: true,
      message: "Option not found",
      data: null,
      statusCode: 404,
    });
  });

  it("should return an error if the option does not belong to the question", async () => {
    mockQuestionRepository.getQuestionById.mockResolvedValue({
      id: "question1",
      question: "Sample question",
      quizId: "quiz1",
    });
    mockOptionRepository.getOptionById.mockResolvedValue({
      questionId: "question2",
      id: "option1",
      text: "Sample option",
      isCorrect: true,
    });

    const response = await submitAnswerUseCase.execute(
      "user1",
      "attempt1",
      "question1",
      "option1"
    );

    expect(response).toEqual({
      error: true,
      message: "Option does not belong to the specified question",
      data: null,
      statusCode: 400,
    });
  });

  it("should submit the answer and return success if not all questions are answered", async () => {
    mockQuestionRepository.getQuestionById.mockResolvedValue({
      id: "question1",
      question: "Sample question",
      quizId: "quiz1",
    });
    mockOptionRepository.getOptionById.mockResolvedValue({
      questionId: "question1",
      id: "option1",
      text: "Sample option",
      isCorrect: true,
    });
    mockUserAnswerRepository.submitAnswer.mockResolvedValue({
      id: "answer1",
      attemptId: "attempt1",
      userId: "user1",
      selectedOptionId: "option1",
    } as UserAnswer);
    mockUserAnswerRepository.getAnswersByAttempt.mockResolvedValue([
      {
        id: "answer1",
        attemptId: "attempt1",
        userId: "user1",
        selectedOptionId: "option1",
      },
    ]);
    mockQuestionRepository.getQuestionCountByAttempt.mockResolvedValue(2);

    const response = await submitAnswerUseCase.execute(
      "user1",
      "attempt1",
      "question1",
      "option1"
    );

    expect(response).toEqual({
      error: false,
      message: "Answer submitted successfully",
      data: {
        id: "answer1",
        attemptId: "attempt1",
        userId: "user1",
        selectedOptionId: "option1",
      },
    });
  });

  it("should calculate the score if all questions are answered", async () => {
    mockQuestionRepository.getQuestionById.mockResolvedValue({
      id: "question1",
      question: "Sample question",
      quizId: "quiz1",
    });
    mockOptionRepository.getOptionById.mockResolvedValue({
      id: "option1",
      text: "Sample option",
      isCorrect: true,
      questionId: "question1",
    });
    mockOptionRepository.getOptionById.mockResolvedValue({
      id: "option1",
      text: "Sample option",
      isCorrect: true,
      questionId: "question1",
    });
    mockUserAnswerRepository.submitAnswer.mockResolvedValue({
      id: "answer1",
      attemptId: "attempt1",
      userId: "user1",
      selectedOptionId: "option1",
    } as UserAnswer);
    mockUserAnswerRepository.getAnswersByAttempt.mockResolvedValue([
      {
        id: "answer1",
        attemptId: "attempt1",
        userId: "user1",
        selectedOptionId: "option1",
      },
      {
        id: "answer2",
        attemptId: "attempt1",
        userId: "user1",
        selectedOptionId: "option2",
      },
    ]);
    mockQuestionRepository.getQuestionCountByAttempt.mockResolvedValue(2);
    mockCalculateScoreUseCase.execute.mockResolvedValue(10);

    const response = await submitAnswerUseCase.execute(
      "user1",
      "attempt1",
      "question1",
      "option1"
    );

    expect(response).toEqual({
      error: false,
      message: "Answer submitted and score calculated",
      data: { score: 10 },
    });
  });

  it("should return an error if an exception occurs", async () => {
    mockQuestionRepository.getQuestionById.mockRejectedValue(
      new Error("Database error")
    );

    const response = await submitAnswerUseCase.execute(
      "user1",
      "attempt1",
      "question1",
      "option1"
    );

    expect(response).toEqual({
      error: true,
      message: "Database error",
      data: null,
    });
  });
});
