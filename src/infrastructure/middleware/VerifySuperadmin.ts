import { Request, Response, NextFunction } from "express";
import { VerifySuperAdminToken } from "../../shared/utils/SuperadminToken";
import sendResponse from "../../shared/utils/ResponseHelper";

export function VerifySuperadmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return sendResponse(res, 401, "No token provided", null);
    }

    const decoded = VerifySuperAdminToken(token) as {
      userId: string;
      role: string;
    };

    const { userId, role } = decoded;

    if (role !== "superadmin") {
      return sendResponse(res, 403, "Forbidden: Superadmin only", null);
    }

    res.locals.userId = userId;
    res.locals.role = role;
    return next();
  } catch (error) {
    console.error("Error in VerifySuperadminOnly middleware:", error);
    return sendResponse(res, 500, "Internal server error", null);
  }
}
