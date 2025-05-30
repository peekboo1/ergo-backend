import { IQuizAttemptRepository } from "../../repositories/IQuizAttemptRepository";

export class GetQuizResultBySupervisorAndQuizIdUseCase {
  constructor(private repo: IQuizAttemptRepository) {}

  async execute(quizId: string, supervisorId: string) {
    const results = await this.repo.getByQuizIdAndSupervisorId(
      quizId,
      supervisorId
    );

    return results.map((r) => ({
      id: r.id,
      quizId: r.quizId,
      userId: r.userId,
      quizName: r.quizName,
      employeeName: r.name,
      score: r.score,
    }));
  }
}
