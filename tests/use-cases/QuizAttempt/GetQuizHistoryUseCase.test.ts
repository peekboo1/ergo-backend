import { GetQuizHistoryUseCase } from "../../../src/domain/usecases/QuizAttempt/GetQuizHistoryUseCase";
import { IQuizAttemptRepository } from "../../../src/domain/repositories/IQuizAttemptRepository";

jest.mock("../../../src/domain/repositories/IQuizAttemptRepository");

describe("GetQuizHistoryUseCase", () => {
  let quizAttemptRepository: jest.Mocked<IQuizAttemptRepository>;
  let getQuizHistoryUseCase: GetQuizHistoryUseCase;

  beforeEach(() => {
    quizAttemptRepository = {
      getDetailedAttemptsByUser: jest.fn(),
    } as unknown as jest.Mocked<IQuizAttemptRepository>;

    getQuizHistoryUseCase = new GetQuizHistoryUseCase(quizAttemptRepository);
  });

  it("should return quiz history with quiz titles and answers for a user", async () => {
    const mockAttempts = [
      {
        id: "attempt1",
        quiz: {
          id: "quiz1", 
          title: "Quiz 1",
        },
        answers: [
          {
            id: "answer1",
            option: {
              id: "option1", 
              text: "Option A",
              isCorrect: true,
            },
          },
          {
            id: "answer2", 
            option: {
              id: "option2",
              text: "Option B",
              isCorrect: false,
            },
          },
        ],
        createdAt: new Date("2023-01-01").toISOString(), 
      },
      {
        quiz: {
          id: "quiz2", 
          title: "Quiz 2",
        },
        answers: [
          {
            id: "answer3",
            option: {
              id: "option3", 
              text: "Option C",
              isCorrect: true,
            },
          },
          {
            id: "answer4", 
            option: {
              id: "option4",
              text: "Option D",
              isCorrect: true,
            },
          },
        ],
        createdAt: new Date("2023-01-02").toISOString(),
      },
    ];

    quizAttemptRepository.getDetailedAttemptsByUser.mockResolvedValue(
      mockAttempts.map(attempt => ({
      ...attempt,
      id: attempt.id || "default-id", 
      }))
    );

    const result = await getQuizHistoryUseCase.execute("user1");

    expect(result).toEqual([
      {
        quiz_title: "Quiz 1",
        answers: [
          { text: "Option A", isCorrect: true },
          { text: "Option B", isCorrect: false },
        ],
        createdAt: new Date("2023-01-01").toISOString(), 
      },
      {
        quiz_title: "Quiz 2",
        answers: [
          { text: "Option C", isCorrect: true },
          { text: "Option D", isCorrect: true },
        ],
        createdAt: new Date("2023-01-02").toISOString(), 
      },
    ]);
    expect(
      quizAttemptRepository.getDetailedAttemptsByUser
    ).toHaveBeenCalledWith("user1");
  });

  it("should return an empty array if no quiz attempts are found for the user", async () => {
    quizAttemptRepository.getDetailedAttemptsByUser.mockResolvedValue([]);

    const result = await getQuizHistoryUseCase.execute("user1");

    expect(result).toEqual([]);
    expect(
      quizAttemptRepository.getDetailedAttemptsByUser
    ).toHaveBeenCalledWith("user1");
  });

  it("should handle errors thrown by the repository", async () => {
    quizAttemptRepository.getDetailedAttemptsByUser.mockRejectedValue(
      new Error("Database error")
    );

    await expect(getQuizHistoryUseCase.execute("user1")).rejects.toThrow(
      "Database error"
    );
  });
});
