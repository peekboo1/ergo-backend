import { GetErgonomicHistoryUseCase } from "../../../src/domain/usecases/Ergonomic/GetErgonomicHistoryUseCase";
import { IErgonomicAnalysisRepository } from "../../../src/domain/repositories/IErgonomicRepository";

describe("GetErgonomicHistoryUseCase", () => {
  let mockRepo: jest.Mocked<IErgonomicAnalysisRepository>;
  let useCase: GetErgonomicHistoryUseCase;

  beforeEach(() => {
    mockRepo = {
      getErgonomicsHistory: jest.fn(),
      uploadErgonomics: jest.fn(),
      getAllErgonomicsHistoryBySupervisorId: jest.fn(),
    };
    useCase = new GetErgonomicHistoryUseCase(mockRepo);
  });

  it("should return history for a valid user ID", async () => {
    const userId = "user123";
    const mockHistory = [{ id: 1, data: "test" }];
    mockRepo.getErgonomicsHistory.mockResolvedValue(mockHistory);

    const result = await useCase.execute(userId);

    expect(mockRepo.getErgonomicsHistory).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockHistory);
  });

  it("should return an empty array if no history exists for the user", async () => {
    const userId = "user456";
    mockRepo.getErgonomicsHistory.mockResolvedValue([]);

    const result = await useCase.execute(userId);

    expect(mockRepo.getErgonomicsHistory).toHaveBeenCalledWith(userId);
    expect(result).toEqual([]);
  });

  it("should throw an error if the repository throws an error", async () => {
    const userId = "user789";
    mockRepo.getErgonomicsHistory.mockRejectedValue(
      new Error("Repository error")
    );

    await expect(useCase.execute(userId)).rejects.toThrow("Repository error");
    expect(mockRepo.getErgonomicsHistory).toHaveBeenCalledWith(userId);
  });
});
