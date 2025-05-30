import { IQuizAttemptRepository } from "../../repositories/IQuizAttemptRepository";
import { QuizAttempt } from "../../entities/QuizAttempt";

export class StartQuizUseCase {
  constructor(private attemptRepository: IQuizAttemptRepository) {}

  async execute(userId: string, quizId: string): Promise<QuizAttempt> {
    if (!userId || !quizId) {
      throw new Error("Quiz ID and question text are required");
    }

    return await this.attemptRepository.startAttempt(userId, quizId);
  }
}
