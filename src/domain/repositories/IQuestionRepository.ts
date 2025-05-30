import { Question } from "../entities/Question";

export interface IQuestionRepository {
  addQuestion(quizId: string, question: string): Promise<Question>;
  updateQuestion(id: string, question: Partial<Question>): Promise<Question>;
  getQuestionsByQuizId(quizId: string): Promise<Question[]>;
  getQuestionById(id: string): Promise<Question | null>;
  deleteQuestion(id: string): Promise<void>;
  getQuestionCountByAttempt(attemptId: string): Promise<number>;
}
