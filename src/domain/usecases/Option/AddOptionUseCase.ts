import { IOptionRepository } from "../../repositories/IOptionRepository";
import { IResponse } from "../../../shared/utils/IResponse";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/CreateResponse";

export class AddOptionsUseCase {
  constructor(private optionRepository: IOptionRepository) {}

  async execute(
    questionId: string,
    options: { text: string; isCorrect: boolean }[]
  ): Promise<IResponse<any>> {
    try {
      if (!questionId) return errorResponse("Question ID is required", 400);
      
      if (options.length !== 4)
        return errorResponse("Exactly 4 options are required", 400);

      const result = await this.optionRepository.addOptions(
        questionId,
        options
      );
      return successResponse("Options added successfully", result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add options";
      return errorResponse(message, 500);
    }
  }
}
