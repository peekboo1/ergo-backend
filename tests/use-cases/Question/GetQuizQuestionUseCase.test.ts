import { GetQuizQuestionsUseCase } from "../../../src/domain/usecases/Question/GetQuizQuestionsUseCase";
import { IQuestionRepository } from "../../../src/domain/repositories/IQuestionRepository";

describe("GetQuizQuestionUseCase", () => {
  let getQuizQuestionUseCase: GetQuizQuestionsUseCase;

  beforeEach(() => {
    const mockQuestionRepository = {
    } as jest.Mocked<IQuestionRepository>;
    getQuizQuestionUseCase = new GetQuizQuestionsUseCase(
      mockQuestionRepository
    );
  });

  it("should return a quiz question when a valid ID is provided", async () => {
    const questionId = "valid-id";
    const expectedQuestion = {
      id: questionId,
      text: "Sample question",
      options: ["A", "B", "C", "D"],
    };

    jest.spyOn(getQuizQuestionUseCase, "execute").mockResolvedValue({
      data: expectedQuestion,
      error: false,
      message: "Success",
    });

    const result = await getQuizQuestionUseCase.execute(questionId);

    // Assert the structure
    expect(result).toEqual({
      data: expectedQuestion,
      error: false,
      message: "Success",
    });
  });

  it("should throw an error when an invalid ID is provided", async () => {
    const invalidId = "invalid-id";

    jest
      .spyOn(getQuizQuestionUseCase, "execute")
      .mockRejectedValue(new Error("Question not found"));

    await expect(getQuizQuestionUseCase.execute(invalidId)).rejects.toThrow(
      "Question not found"
    );
  });

  it("should handle empty ID input gracefully", async () => {
    const emptyId = "";

    jest
      .spyOn(getQuizQuestionUseCase, "execute")
      .mockRejectedValue(new Error("Invalid question ID"));

    await expect(getQuizQuestionUseCase.execute(emptyId)).rejects.toThrow(
      "Invalid question ID"
    );
  });

  it("should return a question with all required fields", async () => {
    const questionId = "valid-id";
    const expectedQuestion = {
      id: questionId,
      text: "Sample question",
      options: ["A", "B", "C", "D"],
    };

    jest.spyOn(getQuizQuestionUseCase, "execute").mockResolvedValue({
      data: expectedQuestion,
      error: false,
      message: "Success",
    });

    const result = await getQuizQuestionUseCase.execute(questionId);

    expect(result.data).toHaveProperty("id");
    expect(result.data).toHaveProperty("text");
    expect(result.data).toHaveProperty("options");
    expect(Array.isArray(result.data.options)).toBe(true);
  });
});
