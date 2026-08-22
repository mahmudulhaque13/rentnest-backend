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

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await propertyService.getAllProperties(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getMyProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await propertyService.getMyProperties(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My properties retrieved successfully",
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

const updatePropertyAvailability = catchAsync(
  async (req: Request, res: Response) => {
    const result = await propertyService.updatePropertyAvailability(
      req.params.id as string,
      req.body.status,
      req.user!.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property availability updated successfully",
      data: result,
    });
  },
);

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
  getMyProperties,
  getSingleProperty,
  updateProperty,
  updatePropertyAvailability,
  deleteProperty,
};
