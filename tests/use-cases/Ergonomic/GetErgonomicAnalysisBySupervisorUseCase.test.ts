import { GetErgonomicAnalysisBySupervisorUseCase } from "../../../src/domain/usecases/Ergonomic/GetErgonomicAnalysisBySupervisorUseCase";
import { IErgonomicAnalysisRepository } from "../../../src/domain/repositories/IErgonomicRepository";

describe("GetErgonomicAnalysisBySupervisorUseCase", () => {
  let mockRepo: jest.Mocked<IErgonomicAnalysisRepository>;
  let useCase: GetErgonomicAnalysisBySupervisorUseCase;

  beforeEach(() => {
    mockRepo = {
      getAllErgonomicsHistoryBySupervisorId: jest.fn(),
    } as unknown as jest.Mocked<IErgonomicAnalysisRepository>;

    useCase = new GetErgonomicAnalysisBySupervisorUseCase(mockRepo);
  });

  it("should return formatted analyses when no month is provided", async () => {
    const mockData = [
      {
        id: "1",
        userId: "user1",
        name: "Analysis 1",
        fileUrl: "url1",
        skorLututReba: 1,
        skorSikuReba: 2,
        skorLeherReba: 3,
        skorTrunkReba: 4,
        skorPergelanganRula: 5,
        skorBahuRula: 6,
        skorSikuRula: 7,
        totalReba: 8,
        totalRula: 9,
        feedback: "Good",
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2023-01-16"),
      },
      {
        id: "2",
        userId: "user2",
        name: "Analysis 2",
        fileUrl: "url2",
        skorLututReba: 2,
        skorSikuReba: 3,
        skorLeherReba: 4,
        skorTrunkReba: 5,
        skorPergelanganRula: 6,
        skorBahuRula: 7,
        skorSikuRula: 8,
        totalReba: 9,
        totalRula: 10,
        feedback: "Excellent",
        createdAt: new Date("2023-02-20"),
        updatedAt: new Date("2023-02-21"),
      },
    ];

    mockRepo.getAllErgonomicsHistoryBySupervisorId.mockResolvedValue(mockData);

    const result = await useCase.execute("supervisor1");

    expect(result).toEqual({
      january: [mockData[0]],
      february: [mockData[1]],
    });
    expect(mockRepo.getAllErgonomicsHistoryBySupervisorId).toHaveBeenCalledWith(
      "supervisor1"
    );
  });

  it("should filter analyses by the provided month", async () => {
    const mockData = [
      {
        id: "1",
        userId: "user1",
        name: "Analysis 1",
        fileUrl: "url1",
        skorLututReba: 1,
        skorSikuReba: 2,
        skorLeherReba: 3,
        skorTrunkReba: 4,
        skorPergelanganRula: 5,
        skorBahuRula: 6,
        skorSikuRula: 7,
        totalReba: 8,
        totalRula: 9,
        feedback: "Good",
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2023-01-16"),
      },
      {
        id: "2",
        userId: "user2",
        name: "Analysis 2",
        fileUrl: "url2",
        skorLututReba: 2,
        skorSikuReba: 3,
        skorLeherReba: 4,
        skorTrunkReba: 5,
        skorPergelanganRula: 6,
        skorBahuRula: 7,
        skorSikuRula: 8,
        totalReba: 9,
        totalRula: 10,
        feedback: "Excellent",
        createdAt: new Date("2023-02-20"),
        updatedAt: new Date("2023-02-21"),
      },
    ];

    mockRepo.getAllErgonomicsHistoryBySupervisorId.mockResolvedValue(mockData);

    const result = await useCase.execute("supervisor1", "01");

    expect(result).toEqual([mockData[0]]);
    expect(mockRepo.getAllErgonomicsHistoryBySupervisorId).toHaveBeenCalledWith(
      "supervisor1"
    );
  });

  it("should return an empty array if no analyses match the provided month", async () => {
    const mockData = [
      {
        id: "1",
        userId: "user1",
        name: "Analysis 1",
        fileUrl: "url1",
        skorLututReba: 1,
        skorSikuReba: 2,
        skorLeherReba: 3,
        skorTrunkReba: 4,
        skorPergelanganRula: 5,
        skorBahuRula: 6,
        skorSikuRula: 7,
        totalReba: 8,
        totalRula: 9,
        feedback: "Good",
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2023-01-16"),
      },
    ];

    mockRepo.getAllErgonomicsHistoryBySupervisorId.mockResolvedValue(mockData);

    const result = await useCase.execute("supervisor1", "02");

    expect(result).toEqual([]);
    expect(mockRepo.getAllErgonomicsHistoryBySupervisorId).toHaveBeenCalledWith(
      "supervisor1"
    );
  });
});
