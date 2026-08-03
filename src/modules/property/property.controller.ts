import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { propertyService } from "./property.service";
import AppError from "../../utils/appError";

type PropertyParams = {
  id: string;
};

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await propertyService.createProperty(req.body, req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await propertyService.getAllProperties();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result,
  });
});

const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const result = await propertyService.getSingleProperty(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property retrieved successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await propertyService.updateProperty(
    req.params.id as string,
    req.body,
    req.user!.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await propertyService.deleteProperty(
    req.params.id as string,
    req.user!.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted successfully",
    data: result,
  });
});

export const propertyController = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
};
