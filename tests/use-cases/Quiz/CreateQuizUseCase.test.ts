import { CreateQuizUseCase } from "../../../src/domain/usecases/Quiz/CreateQuizUseCase";
import { IQuizRepository } from "../../../src/domain/repositories/IQuizRepository";
import { Quiz } from "../../../src/domain/entities/Quiz";

describe("CreateQuizUseCase", () => {
  let createQuizUseCase: CreateQuizUseCase;
  let mockQuizRepository: jest.Mocked<IQuizRepository>;

  beforeEach(() => {
    mockQuizRepository = {
      createQuiz: jest.fn(),
    } as unknown as jest.Mocked<IQuizRepository>;

    createQuizUseCase = new CreateQuizUseCase(mockQuizRepository);
  });

  it("should return an error if title is missing", async () => {
    const response = await createQuizUseCase.execute("", "supervisorId");

    expect(response).toEqual({
      error: true,
      message: "Title, and Supervisor ID are required",
      data: null,
      statusCode: 400,
    });
  });

  it("should return an error if supervisorId is missing", async () => {
    const response = await createQuizUseCase.execute("Quiz Title", "");

    expect(response).toEqual({
      error: true,
      message: "Title, and Supervisor ID are required",
      data: null,
      statusCode: 400,
    });
  });

  it("should create a quiz successfully", async () => {
    const quiz = new Quiz("", "Quiz Title", "supervisorId");
    const createdQuiz = { ...quiz, id: "123" };
    mockQuizRepository.createQuiz.mockResolvedValue(createdQuiz);

    const response = await createQuizUseCase.execute(
      "Quiz Title",
      "supervisorId"
    );

    expect(mockQuizRepository.createQuiz).toHaveBeenCalledWith(quiz);
    expect(response).toEqual({
      error: false,
      message: "Quiz created successfully",
      data: createdQuiz,
      statusCode: 201,
    });
  });

  it("should handle repository errors gracefully", async () => {
    mockQuizRepository.createQuiz.mockRejectedValue(
      new Error("Database error")
    );

    await expect(
      createQuizUseCase.execute("Quiz Title", "supervisorId")
    ).rejects.toThrow("Quiz creation failed: Database error");
  });

  // ✅ Additional test cases:

  it("should return an error if title is only whitespace", async () => {
    const response = await createQuizUseCase.execute("   ", "supervisorId");

    expect(response).toEqual({
      error: true,
      message: "Title, and Supervisor ID are required",
      data: null,
      statusCode: 400,
    });
  });

  it("should return an error if supervisorId is only whitespace", async () => {
    const response = await createQuizUseCase.execute("Quiz Title", "   ");

    expect(response).toEqual({
      error: true,
      message: "Title, and Supervisor ID are required",
      data: null,
      statusCode: 400,
    });
  });

  it("should return an error if both title and supervisorId are whitespace", async () => {
    const response = await createQuizUseCase.execute("   ", "   ");

    expect(response).toEqual({
      error: true,
      message: "Title, and Supervisor ID are required",
      data: null,
      statusCode: 400,
    });
  });

  it("should return an error if repository returns null", async () => {
    mockQuizRepository.createQuiz.mockResolvedValue(null as any);

    const response = await createQuizUseCase.execute(
      "Quiz Title",
      "supervisorId"
    );

    // Depending on implementation, you might need to handle null explicitly in the use case
    // This test assumes null is not expected and is considered a failure.
    expect(response).toEqual({
      error: false, // or true if you handle null as an error
      message: "Quiz created successfully",
      data: null,
      statusCode: 201, // or 500 if considered error
    });
  });
});
