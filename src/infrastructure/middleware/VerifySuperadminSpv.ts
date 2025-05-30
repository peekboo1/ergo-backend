import { Request, Response, NextFunction } from "express";
import { EmployeeModel } from "../db/models/EmployeeModels";
import { verifyToken } from "../../shared/utils/JwtUtils";
import sendResponse from "../../shared/utils/ResponseHelper";

export async function VerifyAccessSuperadminSpvEmp(
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
    const targetEmployeeId = req.params.id;

    if (!targetEmployeeId) {
      return sendResponse(res, 403, "No target employee ID provided", null);
    }

    if (role === "superadmin") {
      res.locals.userId = userId;
      res.locals.role = role;
      return next();
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
    return sendResponse(res, 403, "Forbidden: Invalid role", null);
  } catch (error) {
    console.error("Error in VerifyAccessToEmployee middleware:", error);
    return sendResponse(res, 500, "Internal server error", null);
  }
}
