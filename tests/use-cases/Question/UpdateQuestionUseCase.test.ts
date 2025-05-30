import { UpdateQuestionUseCase } from "../../../src/domain/usecases/Question/UpdateQuestionUseCase";
import { IQuestionRepository } from "../../../src/domain/repositories/IQuestionRepository";

describe("UpdateQuestionUseCase", () => {
  let updateQuestionUseCase: UpdateQuestionUseCase;
  let mockQuestionRepository: jest.Mocked<IQuestionRepository>;

  beforeEach(() => {
    mockQuestionRepository = {
      updateQuestion: jest.fn(),
      addQuestion: jest.fn(),
      getQuestionsByQuizId: jest.fn(),
      deleteQuestion: jest.fn(),
      getQuestionCountByAttempt: jest.fn(),
      getQuestionById: jest.fn().mockResolvedValue({
        id: "123",
        question: "Sample question",
        quizId: "456",
      }),
    } as jest.Mocked<IQuestionRepository>;

    updateQuestionUseCase = new UpdateQuestionUseCase(mockQuestionRepository);
  });

  it("should call the repository with correct parameters", async () => {
    mockQuestionRepository.updateQuestion.mockResolvedValue({
      id: "123",
      question: "Updated question text",
      quizId: "456",
    });

    const response = await updateQuestionUseCase.execute(
      "123",
      "Updated question text"
    );

    expect(mockQuestionRepository.updateQuestion).toHaveBeenCalledWith("123", {
      question: "Updated question text",
    });

    expect(response).toEqual({
      error: false,
      statusCode: 200,
      message: "Question updated successfully",
      data: { id: "123", question: "Updated question text", quizId: "456" },
    });
  });
});
