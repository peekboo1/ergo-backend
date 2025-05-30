import { AddQuestionUseCase } from "../../../src/domain/usecases/Question/AddQuestionUseCase";
import { IQuestionRepository } from "../../../src/domain/repositories/IQuestionRepository";
import { error } from "console";

describe("AddQuestionUseCase", () => {
  let addQuestionUseCase: AddQuestionUseCase;
  let mockQuestionRepository: jest.Mocked<IQuestionRepository>;

  beforeEach(() => {
    mockQuestionRepository = {
      addQuestion: jest.fn(),
      updateQuestion: jest.fn(),
      getQuestionsByQuizId: jest.fn(),
      deleteQuestion: jest.fn(),
      getQuestionCountByAttempt: jest.fn(),
    } as unknown as jest.Mocked<IQuestionRepository>;

    addQuestionUseCase = new AddQuestionUseCase(mockQuestionRepository);
  });

  it("should return an error response if quizId is not provided", async () => {
    const response = await addQuestionUseCase.execute("", "Sample question");
    expect(response).toEqual({
      error: true,
      data: null,
      message: "Quiz ID and question text are required",
      statusCode: 400,
    });
  });

  it("should return an error response if question is not provided", async () => {
    const response = await addQuestionUseCase.execute("quiz123", "");
    expect(response).toEqual({
      error: true,
      data: null,
      message: "Quiz ID and question text are required",
      statusCode: 400,
    });
  });

  it("should call the repository's addQuestion method with correct parameters", async () => {
    mockQuestionRepository.addQuestion.mockResolvedValue({
      id: "question123",
      question: "Sample question",
      quizId: "quiz123",
    });

    const response = await addQuestionUseCase.execute(
      "quiz123",
      "Sample question"
    );

    expect(mockQuestionRepository.addQuestion).toHaveBeenCalledWith(
      "quiz123",
      "Sample question"
    );
    expect(response).toEqual({
      error: false,
      statusCode: 200,
      message: "Question added successfully",
      data: { id: "question123", question: "Sample question", quizId: "quiz123" },
    });
  });

  it("should return an error response if the repository throws an error", async () => {
    mockQuestionRepository.addQuestion.mockRejectedValue(
      new Error("Database error")
    );

    const response = await addQuestionUseCase.execute(
      "quiz123",
      "Sample question"
    );

    expect(response).toEqual({
      error: true,
      data: null,
      message: "Database error",
      statusCode: 500,
    });
  });

  it("should return a generic error message if the repository throws a non-Error object", async () => {
    mockQuestionRepository.addQuestion.mockRejectedValue("Unknown error");

    const response = await addQuestionUseCase.execute(
      "quiz123",
      "Sample question"
    );

    expect(response).toEqual({
      error: true,
      data: null,
      message: "Failed to add question",
      statusCode: 500,
    });
  });
});
