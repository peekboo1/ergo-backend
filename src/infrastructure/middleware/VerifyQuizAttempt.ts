import { Request, Response, NextFunction } from "express";
import { QuizAttemptModel } from "../db/models/QuizAttemptModels";
import sendResponse from "../../shared/utils/ResponseHelper";

export async function VerifyQuizAttempt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { quizAttemptId } = req.params;
    const userId = res.locals.userId;

    const quizAttempt = await QuizAttemptModel.findOne({
      where: { id: quizAttemptId },
      attributes: ["userId"],
    });

    if (!quizAttempt) {
      return sendResponse(res, 404, "Quiz attempt not found", null);
    }

    if (quizAttempt.userId !== userId) {
      return sendResponse(
        res,
        403,
        "Access denied. You are not the owner of this quiz attempt.",
        null
      );
    }

    next();
  } catch (error) {
    console.error("Error in verifyQuizAttemptOwner middleware:", error);
    return sendResponse(res, 500, "Internal server error", null);
  }
}
