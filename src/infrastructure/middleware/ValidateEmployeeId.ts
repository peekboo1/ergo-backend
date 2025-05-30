import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sendResponse } from "../../shared/utils/CreateResponse";
import { IResponse } from "../../shared/utils/IResponse";
const idSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format. Must be UUID." }),
});

export function validateEmployeeIdParam(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const validation = idSchema.safeParse(req.params);

  if (!validation.success) {
    const response: IResponse<null> = {
      statusCode: 400,
      error: true,
      message: validation.error.errors[0].message,
      data: null,
    };

    sendResponse(res, response);
    return; // keluar dari fungsi agar tidak lanjut ke next()
  }

  next();
}
