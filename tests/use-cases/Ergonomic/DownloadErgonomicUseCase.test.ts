import { DownloadEmployeeErgonomicPDFUseCase } from "../../../src/domain/usecases/Ergonomic/DownloadErgonomicUseCase";
import { IErgonomicAnalysisRepository } from "../../../src/domain/repositories/IErgonomicRepository";

describe("DownloadEmployeeErgonomicPDFUseCase", () => {
  let mockRepo: jest.Mocked<IErgonomicAnalysisRepository>;
  let useCase: DownloadEmployeeErgonomicPDFUseCase;

  beforeEach(() => {
    mockRepo = {
      getErgonomicsHistory: jest.fn(),
      getAllErgonomicsHistoryBySupervisorId: jest.fn(),
      uploadErgonomics: jest.fn(),
    };
    useCase = new DownloadEmployeeErgonomicPDFUseCase(mockRepo);
  });

  it("should throw an error if no ergonomic data is found", async () => {
    mockRepo.getErgonomicsHistory.mockResolvedValueOnce([]);
    await expect(useCase.execute("employeeId", "supervisorId")).rejects.toThrow(
      "No ergonomic data found for this employee."
    );
  });

  it("should generate a PDF buffer if ergonomic data is found", async () => {
    mockRepo.getErgonomicsHistory.mockResolvedValueOnce([
      {
        fileUrl: "http://example.com/file.pdf",
        skorBahuRula: 1,
        skorLeherReba: 2,
        skorLututReba: 3,
        skorPergelanganRula: 4,
        skorSikuReba: 5,
        skorSikuRula: 6,
        skorTrunkReba: 7,
        skorSudutBahu: 8,
        skorSudutLeher: 9,
        skorSudutLutut: 10,
        skorSudutPahaPunggung: 11,
        sudutPergelangan: 12,
        sudutSiku: 13,
        sudutSikuRula: 14,
        totalReba: 15,
        totalRula: 16,
        feedback: "Good posture",
      },
    ]);

    const result = await useCase.execute("employeeId", "supervisorId");
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should call the repository with the correct employee ID", async () => {
    mockRepo.getErgonomicsHistory.mockResolvedValueOnce([
      {
        fileUrl: "http://example.com/file.pdf",
        skorBahuRula: 1,
        skorLeherReba: 2,
        skorLututReba: 3,
        skorPergelanganRula: 4,
        skorSikuReba: 5,
        skorSikuRula: 6,
        skorTrunkReba: 7,
        skorSudutBahu: 8,
        skorSudutLeher: 9,
        skorSudutLutut: 10,
        skorSudutPahaPunggung: 11,
        sudutPergelangan: 12,
        sudutSiku: 13,
        sudutSikuRula: 14,
        totalReba: 15,
        totalRula: 16,
        feedback: "Good posture",
      },
    ]);

    await useCase.execute("employeeId", "supervisorId");
    expect(mockRepo.getErgonomicsHistory).toHaveBeenCalledWith("employeeId");
  });

  it("should handle missing optional fields gracefully", async () => {
    mockRepo.getErgonomicsHistory.mockResolvedValueOnce([
      {
        fileUrl: "http://example.com/file.pdf",
        skorBahuRula: 1,
        skorLeherReba: 2,
        skorLututReba: 3,
        skorPergelanganRula: 4,
        skorSikuReba: 5,
        skorSikuRula: 6,
        skorTrunkReba: 7,
        feedback: "Good posture",
      },
    ]);

    const result = await useCase.execute("employeeId", "supervisorId");
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);
  });
});
