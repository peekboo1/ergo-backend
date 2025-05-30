import { IErgonomicAnalysisRepository } from "../../repositories/IErgonomicRepository";

export class UploadErgonomicAnalysisUseCase {
  constructor(private repo: IErgonomicAnalysisRepository) {}

  async execute(userId: string, filePath: string) {
    return this.repo.uploadErgonomics(userId, filePath);
  }
}
