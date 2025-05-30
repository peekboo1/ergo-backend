import { UserAnswer } from "../entities/UserAnswer";

export interface IUserAnswerRepository {
  submitAnswer(
    userId: string,
    attemptId: string,
    questionId: string
  ): Promise<UserAnswer>;
  getAnswersByAttemptId(attemptId: string): Promise<UserAnswer[]>;
  getAnswersByUserId(userId: string): Promise<UserAnswer[]>;
  getAnswersByAttempt(attemptId: string): Promise<UserAnswer[]>;
}
