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

const approveRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalRequestService.approveRentalRequest(
    req.params.id as string,
    req.user!.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request approved successfully",
    data: result,
  });
});

const rejectRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalRequestService.rejectRentalRequest(
    req.params.id as string,
    req.user!.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request rejected successfully",
    data: result,
  });
});

const cancelRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalRequestService.cancelRentalRequest(
    req.params.id as string,
    req.user!.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request cancelled successfully",
    data: result,
  });
});

export const rentalRequestController = {
  createRentalRequest,
  getMyRentalRequests,
  getLandlordRentalRequests,
  approveRentalRequest,
  rejectRentalRequest,
  cancelRentalRequest,
};
