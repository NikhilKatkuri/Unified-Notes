import type { Request, Response, NextFunction } from "express";

import { ENV } from "./env.js";

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(500).json({
    status: "error",
    success: false,
    message: ENV.isProduction ? "Something went wrong" : err.message,
    stack: ENV.isProduction ? undefined : err.stack,
  });
};

export default globalErrorHandler;
