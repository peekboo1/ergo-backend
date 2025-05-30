import { DeleteQuestionUseCase } from "../../../src/domain/usecases/Question/DeleteQuestionUseCase";
import { IQuestionRepository } from "../../../src/domain/repositories/IQuestionRepository";
import { error } from "console";

describe("DeleteQuestionUseCase", () => {
  let deleteQuestionUseCase: DeleteQuestionUseCase;
  let mockQuestionRepository: jest.Mocked<IQuestionRepository>;

  beforeEach(() => {
    mockQuestionRepository = {
      deleteQuestion: jest.fn(),
    } as unknown as jest.Mocked<IQuestionRepository>;

    deleteQuestionUseCase = new DeleteQuestionUseCase(mockQuestionRepository);
  });

  it("should delete a question successfully", async () => {
    mockQuestionRepository.deleteQuestion.mockResolvedValueOnce();

    const response = await deleteQuestionUseCase.execute("valid-id");

    expect(mockQuestionRepository.deleteQuestion).toHaveBeenCalledWith(
      "valid-id"
    );
    expect(response).toEqual({
      error: false,
      statusCode: 200,
      message: "Question deleted successfully",
      data: null,
    });
  });

  it("should return an error if no ID is provided", async () => {
    const response = await deleteQuestionUseCase.execute("");

    expect(mockQuestionRepository.deleteQuestion).not.toHaveBeenCalled();
    expect(response).toEqual({
      error: true,
      data: null,
      message: "Question ID is required",
      statusCode: 400,
    });
  });

  it("should return an error if the repository throws an error", async () => {
    mockQuestionRepository.deleteQuestion.mockRejectedValueOnce(
      new Error("Repository error")
    );

    const response = await deleteQuestionUseCase.execute("valid-id");

    expect(mockQuestionRepository.deleteQuestion).toHaveBeenCalledWith(
      "valid-id"
    );
    expect(response).toEqual({
      error: true,
      data: null,
      message: "Repository error",
      statusCode: 500,
    });
  });

  it("should return a generic error message if the repository throws a non-Error object", async () => {
    mockQuestionRepository.deleteQuestion.mockRejectedValueOnce(
      "Unknown error"
    );

    const response = await deleteQuestionUseCase.execute("valid-id");

    expect(mockQuestionRepository.deleteQuestion).toHaveBeenCalledWith(
      "valid-id"
    );
    expect(response).toEqual({
      error: true,
      data: null,
      message: "Failed to delete question",
      statusCode: 500,
    });
  });
});
