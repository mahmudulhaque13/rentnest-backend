import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";

import config from "../config";

import { verifyToken } from "../utils/jwt";
import AppError from "../utils/appError";
import { Role } from "@prisma/client";

const auth = (...requiredRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    const decoded = verifyToken(token, config.jwtAccessSecret) as JwtPayload;

    if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
    }

    req.user = decoded;

    next();
  };
};

export default auth;
