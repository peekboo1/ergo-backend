import { IQuizRepository } from "../../repositories/IQuizRepository";

export class GetAllQuizBySupervisorId {
  constructor(private readonly quizRepository: IQuizRepository) {}

  async execute(supervisorId: string) {
    if (!supervisorId) {
      throw new Error("Supervisor ID is required.");
    }

    const quiz = await this.quizRepository.getAllQuizBySupervisorId(
      supervisorId
    );
    if (!quiz || quiz.length === 0) {
      const error: any = new Error(
        "Quiz not found for the given supervisor ID"
      );
      error.statusCode = 404;
      throw error;
    }

    return quiz;
  }
}
