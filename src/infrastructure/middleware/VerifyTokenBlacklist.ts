let tokenBlacklist: Set<string> = new Set(); // Tempat penyimpanan sementara token yang diblokir

export function addTokenToBlacklist(token: string) {
  tokenBlacklist.add(token);
}

export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token);
}

export function verifyTokenBlacklist(req: any, res: any, next: any) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Ambil token dari header Authorization

  if (!token) {
    return res.status(403).json({
      error: true,
      message: "Access denied. No token provided.",
      data: null,
    });
  }

  if (isTokenBlacklisted(token)) {
    return res.status(403).json({
      error: true,
      message: "Invalid token. Please log in again.",
      data: null,
    });
  }

  next(); // Token valid, lanjutkan ke request selanjutnya
}
