import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { rentalRequestService } from "./rentalRequest.service";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalRequestService.createRentalRequest(
    req.body,
    req.user!.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental request created successfully",
    data: result,
  });
});

const getMyRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalRequestService.getMyRentalRequests(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

const getLandlordRentalRequests = catchAsync(
  async (req: Request, res: Response) => {
    const result = await rentalRequestService.getLandlordRentalRequests(
      req.user!.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      data: result,
    });
  },
);

export const rentalRequestController = {
  createRentalRequest,
  getMyRentalRequests,
  getLandlordRentalRequests,
};
