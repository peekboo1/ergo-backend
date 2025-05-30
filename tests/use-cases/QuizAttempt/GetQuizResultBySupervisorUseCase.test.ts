import { GetQuizResultBySupervisorUseCase } from "../../../src/domain/usecases/QuizAttempt/GetQuizResultBySupervisorUseCase";
import { IQuizAttemptRepository } from "../../../src/domain/repositories/IQuizAttemptRepository";

jest.mock("../../../src/domain/repositories/IQuizAttemptRepository");

describe("GetQuizResultBySupervisorUseCase", () => {
  let quizAttemptRepository: jest.Mocked<IQuizAttemptRepository>;
  let getQuizResultBySupervisorUseCase: GetQuizResultBySupervisorUseCase;

  beforeEach(() => {
    quizAttemptRepository = {
      getAllBySupervisorId: jest.fn(),
    } as unknown as jest.Mocked<IQuizAttemptRepository>;

    getQuizResultBySupervisorUseCase = new GetQuizResultBySupervisorUseCase(
      quizAttemptRepository
    );
  });

  it("should return all quiz results grouped by month", async () => {
    const mockResults = [
      {
        id: "attempt1",
        quizId: "quiz1",
        userId: "user1",
        quizName: "Quiz 1",
        name: "Employee 1",
        score: 85,
        createdAt: new Date("2025-01-15T00:00:00Z"),
      },
      {
        id: "attempt2",
        quizId: "quiz1",
        userId: "user2",
        quizName: "Quiz 1",
        name: "Employee 2",
        score: 90,
        createdAt: new Date("2025-03-20T00:00:00Z"),
      },
      {
        id: "attempt3",
        quizId: "quiz2",
        userId: "user3",
        quizName: "Quiz 2",
        name: "Employee 3",
        score: 75,
        createdAt: new Date("2025-01-25T00:00:00Z"),
      },
    ];

    quizAttemptRepository.getAllBySupervisorId.mockResolvedValue(mockResults);

    const result = await getQuizResultBySupervisorUseCase.execute(
      "supervisor1"
    );

    expect(result).toEqual({
      january: [
        {
          id: "attempt1",
          quizId: "quiz1",
          userId: "user1",
          quizName: "Quiz 1",
          employeeName: "Employee 1",
          score: 85,
          createdAt: mockResults[0].createdAt,
        },
        {
          id: "attempt3",
          quizId: "quiz2",
          userId: "user3",
          quizName: "Quiz 2",
          employeeName: "Employee 3",
          score: 75,
          createdAt: mockResults[2].createdAt,
        },
      ],
      march: [
        {
          id: "attempt2",
          quizId: "quiz1",
          userId: "user2",
          quizName: "Quiz 1",
          employeeName: "Employee 2",
          score: 90,
          createdAt: mockResults[1].createdAt,
        },
      ],
    });
  });

  it("should return quiz results filtered by month", async () => {
    const mockResults = [
      {
        id: "attempt1",
        quizId: "quiz1",
        userId: "user1",
        quizName: "Quiz 1",
        name: "Employee 1",
        score: 85,
        createdAt: new Date("2025-01-15T00:00:00Z"),
      },
      {
        id: "attempt2",
        quizId: "quiz1",
        userId: "user2",
        quizName: "Quiz 1",
        name: "Employee 2",
        score: 90,
        createdAt: new Date("2025-03-20T00:00:00Z"),
      },
    ];

    quizAttemptRepository.getAllBySupervisorId.mockResolvedValue(mockResults);

    const result = await getQuizResultBySupervisorUseCase.execute(
      "supervisor1",
      "03"
    );

    expect(result).toEqual([
      {
        id: "attempt2",
        quizId: "quiz1",
        userId: "user2",
        quizName: "Quiz 1",
        employeeName: "Employee 2",
        score: 90,
        createdAt: mockResults[1].createdAt,
      },
    ]);
  });

  it("should return an empty array if no quiz results are found for the supervisor", async () => {
    quizAttemptRepository.getAllBySupervisorId.mockResolvedValue([]);

    const result = await getQuizResultBySupervisorUseCase.execute(
      "supervisor1"
    );

    expect(result).toEqual({});
  });

  it("should handle errors thrown by the repository", async () => {
    quizAttemptRepository.getAllBySupervisorId.mockRejectedValue(
      new Error("Database error")
    );

    await expect(
      getQuizResultBySupervisorUseCase.execute("supervisor1")
    ).rejects.toThrow("Database error");
  });
});
