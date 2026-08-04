import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.createReview(req.user.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const getPropertyReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getPropertyReviews(req.params.propertyId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.updateReview(
    req.user.id,
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  await reviewService.deleteReview(req.user.id, req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: null,
  });
});

export const reviewController = {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
};
