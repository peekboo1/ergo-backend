import { GetOptionByQuestionId } from "../../../src/domain/usecases/Option/GetOptionByQuestionId";
import { IOptionRepository } from "../../../src/domain/repositories/IOptionRepository";

describe("GetOptionByQuestionId Use Case", () => {
  let mockOptionRepository: jest.Mocked<IOptionRepository>;
  let getOptionByQuestionId: GetOptionByQuestionId;

  beforeEach(() => {
    mockOptionRepository = {
      getOptionsByQuestionId: jest.fn(),
      addOptions: jest.fn(),
      getOptionById: jest.fn(),
    };
    getOptionByQuestionId = new GetOptionByQuestionId(mockOptionRepository);
  });

  it("should return an error response if questionId is not provided", async () => {
    const response = await getOptionByQuestionId.execute("");
    expect(response).toEqual({
      error: true,
      data: null,
      message: "Question ID is required",
      statusCode: 400,
    });
  });

  it("should return an error response if no options are found for the questionId", async () => {
    mockOptionRepository.getOptionsByQuestionId.mockResolvedValue([]);
    const response = await getOptionByQuestionId.execute("123");
    expect(response).toEqual({
      error: true,
      data: null,
      message: "No options found for this question",
      statusCode: 404,
    });
    expect(mockOptionRepository.getOptionsByQuestionId).toHaveBeenCalledWith(
      "123"
    );
  });

  it("should return a success response with options if options are found", async () => {
    const mockOptions = [
      { id: "1", text: "Option 1", isCorrect: false, questionId: "123" },
    ];
    mockOptionRepository.getOptionsByQuestionId.mockResolvedValue(mockOptions);
    const response = await getOptionByQuestionId.execute("123");
    expect(response).toEqual({
      error: false,
      message: "Options retrieved successfully",
      data: mockOptions,
      statusCode: 200,
    });
    expect(mockOptionRepository.getOptionsByQuestionId).toHaveBeenCalledWith(
      "123"
    );
  });

  it("should return an error response if an exception occurs", async () => {
    mockOptionRepository.getOptionsByQuestionId.mockRejectedValue(
      new Error("Database error")
    );
    const response = await getOptionByQuestionId.execute("123");
    expect(response).toEqual({
      error: true,
      data: null,
      message: "Database error",
      statusCode: 500,
    });
    expect(mockOptionRepository.getOptionsByQuestionId).toHaveBeenCalledWith(
      "123"
    );
  });

  it("should return a generic error message if an unknown error occurs", async () => {
    mockOptionRepository.getOptionsByQuestionId.mockRejectedValue(
      "Unknown error"
    );
    const response = await getOptionByQuestionId.execute("123");
    expect(response).toEqual({
      error: true,
      data: null,
      message: "Failed to get options",
      statusCode: 500,
    });
    expect(mockOptionRepository.getOptionsByQuestionId).toHaveBeenCalledWith(
      "123"
    );
  });
});
