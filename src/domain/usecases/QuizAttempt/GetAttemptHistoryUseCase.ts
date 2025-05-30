import { IQuizAttemptRepository } from "../../../domain/repositories/IQuizAttemptRepository";

export class GetAttemptHistoryUseCase {
  constructor(private repo: IQuizAttemptRepository) {}

  async execute(userId: string) {
    const history = await this.repo.getHistoryByUser(userId);
    return history;
  }
}
