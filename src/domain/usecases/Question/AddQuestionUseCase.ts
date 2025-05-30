import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { IResponse } from "../../../shared/utils/IResponse";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/CreateResponse";

export class AddQuestionUseCase {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute(quizId: string, question: string): Promise<IResponse<any>> {
    try {
      if (!quizId || !question) {
        return errorResponse("Quiz ID and question text are required", 400);
      }

      const trimmedQuestion = question.trim();

      if (!trimmedQuestion) {
        return errorResponse("Quiz ID and question text are required", 400);
      }

      const created = await this.questionRepository.addQuestion(
        quizId,
        trimmedQuestion
      );
      return successResponse("Question added successfully", created);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add question";
      return errorResponse(message, 500);
    }
  }
}
