import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";

import config from "../config";

import { verifyToken } from "../utils/jwt";
import AppError from "../utils/appError";

const auth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    const decoded = verifyToken(token, config.jwtAccessSecret) as JwtPayload;

    req.user = decoded;

    next();
  };
};

export default auth;
