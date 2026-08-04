import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import httpStatus from "http-status";

import AppError from "../utils/appError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errors: { path: string; message: string }[] = [];

  // Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error";

    errors = err.issues.map((issue) => ({
      path: issue.path.slice(1).join("."),
      message: issue.message,
    }));
  }

  // App Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Prisma Unique Constraint Error
  else if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    statusCode = httpStatus.CONFLICT;
    message = "Duplicate value found";
  }

  // Normal Error
  else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
