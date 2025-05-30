import { IResponse } from "./IResponse";
import express, { Request, Response } from "express";

export function createResponse<T>(
  error: boolean,
  message: string,
  data: T | null,
  statusCode: number
): IResponse<T> {
  return {
    error,
    message,
    data,
    statusCode,
  };
}

export function successResponse<T>(
  message: string,
  data: T,
  statusCode = 200
): IResponse<T> {
  return createResponse<T>(false, message, data, statusCode);
}

export function errorResponse<T = unknown>(
  message: string,
  statusCode = 400
): IResponse<T> {
  return createResponse<T>(true, message, null, statusCode);
}

export function sendResponse<T>(res: Response, result: IResponse<T>) {
  const statusCode = result.statusCode ?? 400;

  return res.status(statusCode).json({
    error: result.error,
    message: result.message,
    data: result.data,
  });
}
