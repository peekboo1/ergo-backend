import { IQuestionRepository } from "../../repositories/IQuestionRepository";
import { IResponse } from "../../../shared/utils/IResponse";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/CreateResponse";

export class DeleteQuestionUseCase {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute(id: string): Promise<IResponse<any>> {
    try {
      if (!id) return errorResponse("Question ID is required", 400);

      await this.questionRepository.deleteQuestion(id);
      return successResponse("Question deleted successfully", null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete question";
      return errorResponse(message, 500);
    }
  }
}
