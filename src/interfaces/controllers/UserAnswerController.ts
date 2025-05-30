import sendResponse from "../../shared/utils/ResponseHelper";
import { Request, Response } from "express";
import { UserAnswerRepository } from "../../infrastructure/db/repositories/UserAnswerRepository";
import { GetAnswersByAttemptIdUseCase } from "../../domain/usecases/Quiz/GetAnswersByAttemptIdUseCase";
import { GetAnswersByUserIdUseCase } from "../../domain/usecases/Quiz/GetAnswersByUserIdUseCase";

const userAnswerRepository = new UserAnswerRepository();

export class UserAnswerController {
  static async getAnswersByAttemptId(req: Request, res: Response) {
    try {
      const { attemptId } = req.params;
      const useCase = new GetAnswersByAttemptIdUseCase(userAnswerRepository);
      const answers = await useCase.execute(attemptId);
      sendResponse(res, 200, "Answers retrieved successfully", answers);
    } catch (error) {
      console.error("Error getting answers by attempt ID:", error);
      sendResponse(res, 500, "Internal server error", null);
    }
  }

  static async getAnswersByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const useCase = new GetAnswersByUserIdUseCase(userAnswerRepository);
      const answers = await useCase.execute(userId);
      sendResponse(res, 200, "Answers retrieved successfully", answers);
    } catch (error) {
      console.error("Error getting answers by user ID:", error);
      sendResponse(res, 500, "Internal server error", null);
    }
  }
}
