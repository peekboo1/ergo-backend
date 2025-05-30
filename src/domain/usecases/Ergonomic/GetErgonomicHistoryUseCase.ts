import { IErgonomicAnalysisRepository } from "../../repositories/IErgonomicRepository";

export class GetErgonomicHistoryUseCase {
  constructor(private repo: IErgonomicAnalysisRepository) {}

  async execute(userId: string) {
    return this.repo.getErgonomicsHistory(userId);
  }
}
