import { UserAnswerRepository } from "../../../infrastructure/db/repositories/UserAnswerRepository";
import { UserAnswer } from "../../entities/UserAnswer";

export class GetAnswersByUserIdUseCase {
  constructor(private userAnswerRepo: UserAnswerRepository) {}

  async execute(userId: string): Promise<UserAnswer[]> {
    return this.userAnswerRepo.getAnswersByUserId(userId);
  }
}
