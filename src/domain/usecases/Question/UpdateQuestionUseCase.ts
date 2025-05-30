import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { IResponse } from "../../../shared/utils/IResponse";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/CreateResponse";

export class UpdateQuestionUseCase {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute(id: string, newText: string): Promise<IResponse<any>> {
    try {
      if (!id || !newText || newText.trim() === "") {
        return errorResponse("Question ID and new text are required", 400);
      }

      const updated = await this.questionRepository.updateQuestion(id, {
        question: newText.trim(),
      });

      return successResponse("Question updated successfully", updated);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update question";
      return errorResponse(message, 500);
    }
  }
}
