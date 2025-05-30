import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../shared/utils/JwtUtils";
import { EmployeeModel } from "../db/models/EmployeeModels";
import sendResponse from "../../shared/utils/ResponseHelper";

export async function VerifyEmployeeOrSupervisor(
  req: any,
  res: any,
  next: any
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
    const targetEmployeeId = req.params.id;

    if (!targetEmployeeId) {
      return sendResponse(res, 403, "No target employee ID provided", null);
    }

    if (role === "supervisor") {
      const employee = await EmployeeModel.findOne({
        where: { id: targetEmployeeId },
      });
      if (!employee) {
        return sendResponse(res, 404, "Employee not found", null);
      }

      if (employee.supervisorId !== userId) {
        return sendResponse(res, 403, "Forbidden: Not Your Employee", null);
      }
      res.locals.userId = userId;
      res.locals.role = role;
      return next();
    }

    if (role === "employee") {
      if (userId !== targetEmployeeId) {
        return sendResponse(
          res,
          403,
          "Forbidden: You can only access your own data",
          null
        );
      }
      res.locals.userId = userId;
      res.locals.role = role;
      return next();
    }
    return sendResponse(res, 403, "Forbidden: Invalid role", null);
  } catch (error) {
    console.error("Error in VerifyEmployeeOrSupervisor middleware:", error);
    return sendResponse(res, 500, "Internal server error", null);
  }
}
