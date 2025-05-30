import { Request, Response, NextFunction } from "express";
import { QuestionModel } from "../db/models/QuestionModels";
import { QuizModel } from "../db/models/QuizModels";
import { EmployeeModel } from "../db/models/EmployeeModels";
import sendResponse from "../../shared/utils/ResponseHelper";

export async function VerifyQuestionAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { quizId, questionId } = req.params;
    const userId = res.locals.userId;
    const role = res.locals.role;

    const whereCondition = quizId ? { quizId } : { id: questionId };

    const question = await QuestionModel.findOne({
      where: whereCondition,
      include: [
        {
          model: QuizModel,
          as: "quiz",
          attributes: ["supervisorId"],
          required: true,
        },
      ],
    });

    if (!question) {
      return sendResponse(res, 404, "Question or quiz not found", null);
    }

    const quizSupervisorId = (question as any).quiz.supervisorId;

    if (role === "supervisor") {
      if (userId !== quizSupervisorId) {
        return sendResponse(
          res,
          403,
          "Access denied. You don't own this question's quiz.",
          null
        );
      }
      return next();
    }

    if (role === "employee") {
      if (req.method === "PUT" || req.method === "DELETE") {
        return sendResponse(
          res,
          403,
          "Access denied. Employees cannot modify or delete questions.",
          null
        );
      }

      const employee = await EmployeeModel.findOne({
        where: { id: userId },
        attributes: ["supervisorId"],
      });

      if (!employee || employee.supervisorId !== quizSupervisorId) {
        return sendResponse(
          res,
          403,
          "Access denied. This quiz doesn't belong to your supervisor.",
          null
        );
      }
      return next();
    }
    return sendResponse(res, 403, "Access denied. Invalid user role", null);
  } catch (error) {
    console.error("Error in VerifyQuestionAccess middleware:", error);
    return sendResponse(res, 500, "Internal server error", null);
  }
}
