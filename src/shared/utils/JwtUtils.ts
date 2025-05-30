import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key";
export function createToken(
  userId: string,
  role: string,
  companyId: string | null
): string {
  const payload = { userId, role, companyId };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
