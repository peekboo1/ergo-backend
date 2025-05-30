import { IUserAnswerRepository } from "../../repositories/IUserAnswerRepository";
import { IQuizAttemptRepository } from "../../repositories/IQuizAttemptRepository";
import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { UserAnswer } from "../../entities/UserAnswer";

export class CalculateScoreUseCase {
  constructor(
    private userAnswerRepository: IUserAnswerRepository,
    private attemptRepository: IQuizAttemptRepository,
    private questionRepository: IQuestionRepository
  ) {}

  async execute(attemptId: string): Promise<number> {
    let userAnswers: UserAnswer[];

    try {
      userAnswers = await this.userAnswerRepository.getAnswersByAttemptId(
        attemptId
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to retrieve answers: " + error.message);
      } else {
        throw new Error("Failed to retrieve answers due to an unknown error.");
      }
    }

    const totalQuestions =
      await this.questionRepository.getQuestionCountByAttempt(attemptId);

    if (!userAnswers || userAnswers.length < totalQuestions) {
      throw new Error("You haven't answered all the questions yet.");
    }

    let correct = 0;
    for (const ans of userAnswers) {
      if (ans.isCorrect) {
        correct++;
      }
    }

    const score = Math.round((correct / totalQuestions) * 100);
    await this.attemptRepository.updateScore(attemptId, score);

    return score;
  }
}
