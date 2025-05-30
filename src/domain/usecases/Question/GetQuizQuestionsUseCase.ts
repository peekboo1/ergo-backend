import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { IResponse } from "../../../shared/utils/IResponse";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/CreateResponse";

export class GetQuizQuestionsUseCase {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute(quizId: string): Promise<IResponse<any>> {
    try {
      if (!quizId) return errorResponse("Quiz ID is required", 400);

      const questions = await this.questionRepository.getQuestionsByQuizId(
        quizId
      );
      if (!questions.length)
        return errorResponse("No questions found for this quiz", 404);

      return successResponse("Questions retrieved successfully", questions);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to retrieve questions";
      return errorResponse(message, 500);
    }
  }
}
