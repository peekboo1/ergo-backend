import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key";

export function authenticateJWT(req: any, res: any, next: any) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({
      error: true,
      message: "Access denied. No token provided.",
      data: null,
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({
        error: true,
        message: "Invalid token.",
        data: null,
      });
    }

    if (decoded.role !== "supervisor") {
      return res.status(403).json({
        error: true,
        message: "Permission denied. Only supervisors can perform this action.",
        data: null,
      });
    }

    res.locals.supervisorId = decoded.userId;
    res.locals.companyId = decoded.companyId;
    next();
  });
}
