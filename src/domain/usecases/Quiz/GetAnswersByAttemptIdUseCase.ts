import { UserAnswer } from "../../entities/UserAnswer";
import { UserAnswerRepository } from "../../../infrastructure/db/repositories/UserAnswerRepository";

export class GetAnswersByAttemptIdUseCase {
  constructor(private userAnswerRepo: UserAnswerRepository) {}

  async execute(attemptId: string): Promise<UserAnswer[]> {
    return this.userAnswerRepo.getAnswersByAttemptId(attemptId);
  }
}
