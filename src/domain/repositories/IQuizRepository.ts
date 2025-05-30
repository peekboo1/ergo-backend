import { Quiz } from "../entities/Quiz";

export interface IQuizRepository {
  createQuiz(quiz: Quiz): Promise<Quiz>;
  updateQuiz(id: string, quiz: Partial<Quiz>): Promise<Quiz>;
  deleteQuiz(id: string): Promise<void>;
  getAllQuizBySupervisorId(supervisorId: string): Promise<any[]>;
  getQuestionsByQuizId(quizId: string): Promise<any[]>;
}
