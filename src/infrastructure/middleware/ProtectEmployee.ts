import jwt from "jsonwebtoken";
const JWT_SECRET = "your-secret-key";

export function ProtectEmployee(req: any, res: any, next: any) {
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
    const userIdFromToken = decoded.userId;
    if (req.params.id !== userIdFromToken) {
      return res.status(403).json({
        error: true,
        message: "Permission denied. You can only access your own data.",
        data: null,
      });
    }

    res.locals.userId = userIdFromToken;
    next();
  } catch (error) {
    return res.status(403).json({
      error: true,
      message: "Invalid token.",
      data: null,
    });
  }
}
