import { Response } from "express";

const sendResponse = (
  res: Response,
  status: number,
  message: string,
  data?: any | null
) => {
  res.status(status).json({
    error: status >= 400,
    message,
    data,
  });
};

export default sendResponse;
