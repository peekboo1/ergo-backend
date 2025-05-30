import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../shared/utils/JwtUtils";
import { QuizAttemptModel } from "../db/models/QuizAttemptModels";
import { EmployeeModel } from "../db/models/EmployeeModels";
import sendResponse from "../../shared/utils/ResponseHelper";

export async function ProtectQuizData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return sendResponse(res, 401, "No token provided", null);
    }

    const decoded = verifyToken(token) as {
      userId: string;
      role: string;
      companyId: string | null;
    };

    const { userId, role } = decoded;
    const { attemptId } = req.params;

    const attempt = await QuizAttemptModel.findByPk(attemptId);

    if (!attempt) {
      return sendResponse(res, 404, "Attempt not found");
    }

    const targetEmployee = await EmployeeModel.findByPk(attempt.userId);

    if (!targetEmployee) {
      return sendResponse(res, 404, "Employee not found");
    }

    if (userId === targetEmployee.id) {
      return next();
    }

    if (role === "supervisor" && userId === targetEmployee.supervisorId) {
      return next();
    }

    return sendResponse(
      res,
      403,
      "You are not authorized to access this attempt"
    );
  } catch (error) {
    console.error("Authorization error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
}
