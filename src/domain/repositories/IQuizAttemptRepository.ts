import { QuizAttempt } from "../entities/QuizAttempt";
import { Attempt } from "../types/QuizAttemptTypes";

export interface IQuizAttemptRepository {
  startAttempt(userId: string, quizId: string): Promise<QuizAttempt>;
  getAttemptsByUser(userId: string): Promise<QuizAttempt[]>;
  getAttemptById(id: string): Promise<QuizAttempt | null>;
  getDetailedAttemptsByUser(userId: string): Promise<Attempt[]>;
  getHistoryByUser(userId: string): Promise<any[]>;
  updateScore(attemptId: string, score: number): Promise<void>;
  getAllBySupervisorId(supervisorId: string): Promise<any[]>;
  getByQuizIdAndSupervisorId(
    quizId: string,
    supervisorId: string
  ): Promise<any[]>;
}
