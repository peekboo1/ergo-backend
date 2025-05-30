import { IOptionRepository } from "../../repositories/IOptionRepository";
import { IResponse } from "../../../shared/utils/IResponse";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/CreateResponse";

export class GetOptionByQuestionId {
  constructor(private optionRepository: IOptionRepository) {}

  async execute(questionId: string): Promise<IResponse<any>> {
    try {
      if (!questionId) return errorResponse("Question ID is required", 400);

      const options = await this.optionRepository.getOptionsByQuestionId(
        questionId
      );
      if (options.length === 0)
        return errorResponse("No options found for this question", 404);

      return successResponse("Options retrieved successfully", options);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get options";
      return errorResponse(message, 500);
    }
  }
}
