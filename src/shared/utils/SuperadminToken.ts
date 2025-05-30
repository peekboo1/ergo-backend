import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key";
export function superAdminToken(userId: string, role: string): string {
  const payload = { userId, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function VerifySuperAdminToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
