import sendResponse from "../../shared/utils/ResponseHelper";
import { Request, Response } from "express";
import { StartQuizUseCase } from "../../domain/usecases/QuizAttempt/StartQuizUseCase";
import { QuestionRepository } from "../../infrastructure/db/repositories/QuestionRepository";
import { SubmitAnswerUseCase } from "../../domain/usecases/QuizAttempt/SubmitAnswerUseCase";
import { UserAnswerRepository } from "../../infrastructure/db/repositories/UserAnswerRepository";
import { QuizAttemptRepository } from "../../infrastructure/db/repositories/QuizAttemptRepository";
import { GetQuizHistoryUseCase } from "../../domain/usecases/QuizAttempt/GetQuizHistoryUseCase";
import { CalculateScoreUseCase } from "../../domain/usecases/QuizAttempt/CalculateScoreUseCase";
import { GetAttemptHistoryUseCase } from "../../domain/usecases/QuizAttempt/GetAttemptHistoryUseCase";
import { GetQuizResultBySupervisorUseCase } from "../../domain/usecases/QuizAttempt/GetQuizResultBySupervisorUseCase";
import { GetQuizResultBySupervisorAndQuizIdUseCase } from "../../domain/usecases/QuizAttempt/GetQuizResultBySupervisorAndQuizId";
import { OptionRepository } from "../../infrastructure/db/repositories/OptionRepository";

const quizAttemptRepository = new QuizAttemptRepository();
const questionRepository = new QuestionRepository();
const userAnswerRepository = new UserAnswerRepository();
const optionRepository = new OptionRepository();

export class QuizAttemptController {
  static async startQuiz(req: Request, res: Response) {
    try {
      const userId = res.locals.userId;
      const { quizId } = req.params;

      const startQuizUseCase = new StartQuizUseCase(quizAttemptRepository);
      const result = await startQuizUseCase.execute(userId, quizId);

      return sendResponse(res, 201, "Quiz started successfully", result);
    } catch (error) {
      return sendResponse(
        res,
        500,
        error instanceof Error ? error.message : "Internal Server Error"
      );
    }
  }

  static async submitAnswer(req: Request, res: Response) {
    try {
      const userId = res.locals.userId;
      const quizAttemptId = req.params.quizAttemptId;
      const { optionId, questionId } = req.body;

      const calculateScoreUseCase = new CalculateScoreUseCase(
        userAnswerRepository,
        quizAttemptRepository,
        questionRepository
      );

      const submitAnswerUseCase = new SubmitAnswerUseCase(
        userAnswerRepository,
        calculateScoreUseCase,
        questionRepository,
        optionRepository
      );

      const result = await submitAnswerUseCase.execute(
        userId,
        quizAttemptId,
        questionId,
        optionId
      );

      if (result.error) {
        const status = (result as any).statusCode || 400;
        return sendResponse(res, status, result.message, null);
      }

      return sendResponse(res, 201, result.message, result.data);
    } catch (error) {
      return sendResponse(
        res,
        500,
        error instanceof Error ? error.message : "Internal Server Error",
        null
      );
    }
  }

  static async getDetailQuizHistory(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      const getDetailQuizHistory = new GetQuizHistoryUseCase(
        quizAttemptRepository
      );
      const result = await getDetailQuizHistory.execute(userId);

      return sendResponse(res, 200, "Questions retrieved successfully", result);
    } catch (error) {
      return sendResponse(
        res,
        500,
        error instanceof Error ? error.message : "Internal Server Error"
      );
    }
  }

  static async getAttemptHistory(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      const getAttemptHistoryUseCase = new GetAttemptHistoryUseCase(
        quizAttemptRepository
      );
      const result = await getAttemptHistoryUseCase.execute(userId);
      return sendResponse(res, 200, "Ergonomic history fetched", result);
    } catch (error) {
      return sendResponse(res, 500, "Failed to fetch history");
    }
  }

  static async getAllAttemptBySupervisor(req: Request, res: Response) {
    try {
      const supervisorId = res.locals.userId;
      const { month } = req.query as { month?: string };

      const getQuizResultBySupervisorUseCase =
        new GetQuizResultBySupervisorUseCase(quizAttemptRepository);
      const result = await getQuizResultBySupervisorUseCase.execute(
        supervisorId,
        month
      );

      return sendResponse(
        res,
        200,
        "Success get employee quiz history",
        result
      );
    } catch (error) {
      console.error(error);
      return sendResponse(
        res,
        500,
        "Failed to get employee quiz by supervisor"
      );
    }
  }

  static async getAttemptResultByQuizId(req: Request, res: Response) {
    try {
      const supervisorId = res.locals.userId;
      const quizId = req.params.quizId;

      const getAttemptResultByQuizId =
        new GetQuizResultBySupervisorAndQuizIdUseCase(quizAttemptRepository);
      const result = await getAttemptResultByQuizId.execute(
        quizId,
        supervisorId
      );

      return sendResponse(
        res,
        200,
        "Success get quiz result by quizId",
        result
      );
    } catch (error) {
      // console.log(error);
      return sendResponse(res, 500, "Failed to get quiz result by quizId");
    }
  }
}
