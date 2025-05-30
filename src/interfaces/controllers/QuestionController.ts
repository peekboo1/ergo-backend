import { Request, Response } from "express";
import { QuestionRepository } from "../../infrastructure/db/repositories/QuestionRepository";
import { AddQuestionUseCase } from "../../domain/usecases/Question/AddQuestionUseCase";
import { UpdateQuestionUseCase } from "../../domain/usecases/Question/UpdateQuestionUseCase";
import { DeleteQuestionUseCase } from "../../domain/usecases/Question/DeleteQuestionUseCase";
import { GetQuizQuestionsUseCase } from "../../domain/usecases/Question/GetQuizQuestionsUseCase";
import sendResponse from "../../shared/utils/ResponseHelper";

const questionRepository = new QuestionRepository();

export class QuestionController {
  static async createQuestion(req: Request, res: Response) {
    try {
      const { quizId } = req.params;
      const { text } = req.body;

      const addQuestionUseCase = new AddQuestionUseCase(questionRepository);
      const result = await addQuestionUseCase.execute(quizId, text);

      return sendResponse(
        res,
        result.statusCode ?? 500,
        result.message,
        result.data
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      return sendResponse(res, 500, errorMessage);
    }
  }

  static async updateQuestion(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      const { text } = req.body;

      const updateQuestionUseCase = new UpdateQuestionUseCase(
        questionRepository
      );
      const result = await updateQuestionUseCase.execute(questionId, text);

      return sendResponse(
        res,
        result.statusCode ?? 500,
        result.message,
        result.data
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      return sendResponse(res, 500, errorMessage);
    }
  }

  static async deleteQuestion(req: Request, res: Response) {
    try {
      const id = req.params.questionId;
      const deleteQuestionUseCase = new DeleteQuestionUseCase(
        questionRepository
      );
      await deleteQuestionUseCase.execute(id);

      sendResponse(res, 200, "Question Deleted successfully", null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      sendResponse(res, 400, errorMessage);
    }
  }

  static async getQuizQuestions(req: Request, res: Response) {
    try {
      const { quizId } = req.params;
      const useCase = new GetQuizQuestionsUseCase(questionRepository);
      const questions = await useCase.execute(quizId);
      return sendResponse(
        res,
        200,
        "Questions retrieved successfully",
        questions
      );
    } catch (error) {
      return sendResponse(
        res,
        500,
        error instanceof Error ? error.message : "Internal Server Error"
      );
    }
  }
}
