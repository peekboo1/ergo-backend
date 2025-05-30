import { GetAllQuizBySupervisorId } from "../../../src/domain/usecases/Quiz/GetAllQuizBySupervisorId";
import { IQuizRepository } from "../../../src/domain/repositories/IQuizRepository";

describe("GetAllQuizBySupervisorId", () => {
  let mockRepo: jest.Mocked<IQuizRepository>;
  let useCase: GetAllQuizBySupervisorId;

  beforeEach(() => {
    mockRepo = {
      getAllQuizBySupervisorId: jest.fn(),
      createQuiz: jest.fn(),
      updateQuiz: jest.fn(),
      deleteQuiz: jest.fn(),
      getQuestionsByQuizId: jest.fn(),
    };
    useCase = new GetAllQuizBySupervisorId(mockRepo);
  });

  it("should call the repository with the correct supervisorId", async () => {
    const supervisorId = "123";
    mockRepo.getAllQuizBySupervisorId.mockResolvedValue([]);

    try {
      await useCase.execute(supervisorId);
    } catch (_) {
      // Ignore expected error
    }

    expect(mockRepo.getAllQuizBySupervisorId).toHaveBeenCalledWith(
      supervisorId
    );
  });

  it("should return the quizzes from the repository", async () => {
    const supervisorId = "123";
    const quizzes = [
      { id: "1", name: "Quiz 1" },
      { id: "2", name: "Quiz 2" },
    ];
    mockRepo.getAllQuizBySupervisorId.mockResolvedValue(quizzes);

    const result = await useCase.execute(supervisorId);

    expect(result).toEqual(quizzes);
  });

  it("should throw an error if the repository throws an error", async () => {
    const supervisorId = "123";
    mockRepo.getAllQuizBySupervisorId.mockRejectedValue(
      new Error("Repository error")
    );

    await expect(useCase.execute(supervisorId)).rejects.toThrow(
      "Repository error"
    );
  });
});
