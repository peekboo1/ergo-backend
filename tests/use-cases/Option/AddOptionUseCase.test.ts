import { AddOptionsUseCase } from "../../../src/domain/usecases/Option/AddOptionUseCase";
import { IOptionRepository } from "../../../src/domain/repositories/IOptionRepository";

describe("AddOptionsUseCase", () => {
  let addOptionsUseCase: AddOptionsUseCase;
  let mockOptionRepository: jest.Mocked<IOptionRepository>;

  beforeEach(() => {
    mockOptionRepository = {
      addOptions: jest.fn(),
    } as unknown as jest.Mocked<IOptionRepository>;

    addOptionsUseCase = new AddOptionsUseCase(mockOptionRepository);
  });

  it("should return an error response if questionId is not provided", async () => {
    const response = await addOptionsUseCase.execute("", [
      { text: "Option 1", isCorrect: false },
      { text: "Option 2", isCorrect: false },
      { text: "Option 3", isCorrect: false },
      { text: "Option 4", isCorrect: true },
    ]);

    expect(response).toEqual({
      error: true,
      data: null,
      message: "Question ID is required",
      statusCode: 400,
    });
  });

  it("should return an error response if options length is not 4", async () => {
    const response = await addOptionsUseCase.execute("questionId", [
      { text: "Option 1", isCorrect: false },
    ]);

    expect(response).toEqual({
      error: true,
      data: null,
      message: "Exactly 4 options are required",
      statusCode: 400,
    });
  });

  it("should call the repository and return a success response when valid data is provided", async () => {
    const mockOptions = [
      { text: "Option 1", isCorrect: false },
      { text: "Option 2", isCorrect: false },
      { text: "Option 3", isCorrect: false },
      { text: "Option 4", isCorrect: true },
    ];
    const mockResult = {
      id: "123",
      text: "Option 1",
      isCorrect: false,
      questionId: "questionId",
    };

    mockOptionRepository.addOptions.mockResolvedValue([mockResult]);

    const response = await addOptionsUseCase.execute("questionId", mockOptions);

    expect(mockOptionRepository.addOptions).toHaveBeenCalledWith(
      "questionId",
      mockOptions
    );
    expect(response).toEqual({
      error: false,
      message: "Options added successfully",
      data: [mockResult],
      statusCode: 200,
    });
  });

  it("should return an error response if the repository throws an error", async () => {
    mockOptionRepository.addOptions.mockRejectedValue(
      new Error("Database error")
    );

    const response = await addOptionsUseCase.execute("questionId", [
      { text: "Option 1", isCorrect: false },
      { text: "Option 2", isCorrect: false },
      { text: "Option 3", isCorrect: false },
      { text: "Option 4", isCorrect: true },
    ]);

    expect(response).toEqual({
      error: true,
      data: null,
      message: "Database error",
      statusCode: 500,
    });
  });

  it("should return a generic error message if the repository throws a non-Error object", async () => {
    mockOptionRepository.addOptions.mockRejectedValue("Unknown error");

    const response = await addOptionsUseCase.execute("questionId", [
      { text: "Option 1", isCorrect: false },
      { text: "Option 2", isCorrect: false },
      { text: "Option 3", isCorrect: false },
      { text: "Option 4", isCorrect: true },
    ]);

    expect(response).toEqual({
      error: true,
      data: null,
      message: "Failed to add options",
      statusCode: 500,
    });
  });
});
