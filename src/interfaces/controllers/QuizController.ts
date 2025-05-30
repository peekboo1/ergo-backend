import { QuizRepository } from "../../infrastructure/db/repositories/QuizRepository";
import { Request, Response } from "express";
import { CreateQuizUseCase } from "../../domain/usecases/Quiz/CreateQuizUseCase";
import { UpdateQuizUseCase } from "../../domain/usecases/Quiz/UpdateQuizUseCase";
import { GetAllQuizBySupervisorId } from "../../domain/usecases/Quiz/GetAllQuizBySupervisorId";
import sendResponse from "../../shared/utils/ResponseHelper";

const quizRepository = new QuizRepository();

export class QuizController {
  static async createQuiz(req: Request, res: Response) {
    try {
      const supervisorId = res.locals.supervisorId;
      const { title } = req.body;

      const useCase = new CreateQuizUseCase(quizRepository);
      const result = await useCase.execute(title, supervisorId);

      return sendResponse(
        res,
        result.error ? 400 : 200,
        result.message,
        result.data
      );
    } catch (error) {
      return sendResponse(
        res,
        500,
        error instanceof Error ? error.message : "Internal Server Error"
      );
    }
  }

  static async updateQuiz(req: Request, res: Response) {
    try {
      const { quizId } = req.params;
      const { title } = req.body;

      const updateQuizUseCase = new UpdateQuizUseCase(quizRepository);
      const result = await updateQuizUseCase.execute(quizId, title);

      return sendResponse(res, 200, "Quiz updated successfully.", result);
    } catch (error) {
      return sendResponse(
        res,
        500,
        error instanceof Error ? error.message : "Internal Server Error"
      );
    }
  }

  static async getAllQuizBySupervisorId(req: Request, res: Response) {
    try {
      const role = res.locals.role;
      const userId = res.locals.userId;
      const supervisorId = res.locals.supervisorId;

      const quizOwnerId = role === "supervisor" ? userId : supervisorId;

      if (!quizOwnerId) {
        return sendResponse(res, 400, "Unable to determine quiz owner.");
      }

      const getAllQuizbySpvId = new GetAllQuizBySupervisorId(quizRepository);
      const result = await getAllQuizbySpvId.execute(quizOwnerId);

      return sendResponse(res, 200, "Quiz list fetched successfully.", result);
    } catch (error: any) {
      const message = error.message || "Unknown error";
      const status = error.statusCode || 400;
      return sendResponse(res, status, message);
    }
  }
}
