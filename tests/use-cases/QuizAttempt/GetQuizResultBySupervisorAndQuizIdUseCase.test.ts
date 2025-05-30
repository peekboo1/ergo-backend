import { GetQuizResultBySupervisorAndQuizIdUseCase } from "../../../src/domain/usecases/QuizAttempt/GetQuizResultBySupervisorAndQuizId";
import { IQuizAttemptRepository } from "../../../src/domain/repositories/IQuizAttemptRepository";

jest.mock("../../../src/domain/repositories/IQuizAttemptRepository");

describe("GetQuizResultBySupervisorAndQuizIdUseCase", () => {
  let quizAttemptRepository: jest.Mocked<IQuizAttemptRepository>;
  let getQuizResultBySupervisorAndQuizIdUseCase: GetQuizResultBySupervisorAndQuizIdUseCase;

  beforeEach(() => {
    quizAttemptRepository = {
      getByQuizIdAndSupervisorId: jest.fn(),
    } as unknown as jest.Mocked<IQuizAttemptRepository>;

    getQuizResultBySupervisorAndQuizIdUseCase =
      new GetQuizResultBySupervisorAndQuizIdUseCase(quizAttemptRepository);
  });

  it("should return quiz results for a given quizId and supervisorId", async () => {
    const mockResults = [
      {
        id: "attempt1",
        quizId: "quiz1",
        userId: "user1",
        quizName: "Quiz 1",
        name: "Employee 1",
        score: 85,
      },
      {
        id: "attempt2",
        quizId: "quiz1",
        userId: "user2",
        quizName: "Quiz 1",
        name: "Employee 2",
        score: 90,
      },
    ];

    quizAttemptRepository.getByQuizIdAndSupervisorId.mockResolvedValue(
      mockResults
    );

    const result = await getQuizResultBySupervisorAndQuizIdUseCase.execute(
      "quiz1",
      "supervisor1"
    );

    // Assert the expected results
    expect(result).toEqual([
      {
        id: "attempt1",
        quizId: "quiz1",
        userId: "user1",
        quizName: "Quiz 1",
        employeeName: "Employee 1",
        score: 85,
      },
      {
        id: "attempt2",
        quizId: "quiz1",
        userId: "user2",
        quizName: "Quiz 1",
        employeeName: "Employee 2",
        score: 90,
      },
    ]);
    expect(
      quizAttemptRepository.getByQuizIdAndSupervisorId
    ).toHaveBeenCalledWith("quiz1", "supervisor1");
  });

  it("should return an empty array if no quiz attempts are found for the supervisor and quizId", async () => {
    quizAttemptRepository.getByQuizIdAndSupervisorId.mockResolvedValue([]);

    const result = await getQuizResultBySupervisorAndQuizIdUseCase.execute(
      "quiz1",
      "supervisor1"
    );

    expect(result).toEqual([]);
    expect(
      quizAttemptRepository.getByQuizIdAndSupervisorId
    ).toHaveBeenCalledWith("quiz1", "supervisor1");
  });

  it("should handle errors thrown by the repository", async () => {
    quizAttemptRepository.getByQuizIdAndSupervisorId.mockRejectedValue(
      new Error("Database error")
    );

    await expect(
      getQuizResultBySupervisorAndQuizIdUseCase.execute("quiz1", "supervisor1")
    ).rejects.toThrow("Database error");
  });
});
