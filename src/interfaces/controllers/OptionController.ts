import { Request, Response } from "express";
import { OptionRepository } from "../../infrastructure/db/repositories/OptionRepository";
import { AddOptionsUseCase } from "../../domain/usecases/Option/AddOptionUseCase";
import { GetOptionByQuestionId } from "../../domain/usecases/Option/GetOptionByQuestionId";
import sendResponse from "../../shared/utils/ResponseHelper";

const optionRepository = new OptionRepository();

export class OptionController {
  static async addOptions(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      const { options } = req.body;

      const useCase = new AddOptionsUseCase(optionRepository);
      const result = await useCase.execute(questionId, options);

      return sendResponse(
        res,
        result.statusCode ?? 500,
        result.message,
        result.data
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal Server Error";
      console.error("[OptionController] addOptions error", error);
      return sendResponse(res, 500, message);
    }
  }

  static async getOptionsByQuestionId(req: Request, res: Response) {
    try {
      const { questionId } = req.params;

      const useCase = new GetOptionByQuestionId(optionRepository);
      const result = await useCase.execute(questionId);

      return sendResponse(
        res,
        result.statusCode ?? 500,
        result.message,
        result.data
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal Server Error";
      console.error("[OptionController] getOptionsByQuestionId error", error);
      return sendResponse(res, 500, message);
    }
  }
}
