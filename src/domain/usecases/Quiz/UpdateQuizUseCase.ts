import { Quiz } from "../../entities/Quiz";
import { IQuizRepository } from "../../repositories/IQuizRepository";

export class UpdateQuizUseCase {
  constructor(private readonly quizRepository: IQuizRepository) {}

  async execute(id: string, newTitle: string): Promise<Quiz> {
    if (!id || !newTitle || typeof newTitle !== "string") {
      throw new Error("Quiz ID and new title are required.");
    }

    const trimmedId = id.trim();
    const trimmedTitle = newTitle.trim();

    if (!trimmedId || !trimmedTitle) {
      throw new Error("Quiz ID and new title are required.");
    }

    return this.quizRepository.updateQuiz(trimmedId, { title: trimmedTitle });
  }
}
