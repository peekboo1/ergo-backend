import jwt from "jsonwebtoken";
import { EmployeeModel } from "../db/models/EmployeeModels";

const JWT_SECRET = "your-secret-key";

export async function ProtectQuiz(req: any, res: any, next: any) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      error: true,
      message: "Access denied. No token provided.",
      data: null,
    });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    res.locals.userId = decoded.userId;
    res.locals.role = decoded.role;

    if (decoded.role === "employee") {
      const employee = await EmployeeModel.findOne({
        where: { id: decoded.userId },
        attributes: ["supervisorId"],
      });

      if (employee) {
        res.locals.supervisorId = employee.supervisorId;
      }
    }

    next();
  } catch (error) {
    return res.status(403).json({
      error: true,
      message: "Invalid token.",
      data: null,
    });
  }
}
