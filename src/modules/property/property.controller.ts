import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { propertyService } from "./property.service";

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await propertyService.createProperty(req.body, req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: result,
  });
});

export const propertyController = {
  createProperty,
};
