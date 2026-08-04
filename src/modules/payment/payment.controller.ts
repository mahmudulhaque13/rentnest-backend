import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentService.createCheckoutSession(
      req.user!.id,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

// Stripe Webhook
const stripeWebhook = async (req: Request, res: Response) => {
  await paymentService.stripeWebhook(req);

  res.status(httpStatus.OK).json({
    received: true,
  });
};

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getMyPayments(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getLandlordEarnings = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getLandlordEarnings(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Earnings retrieved successfully",
    data: result,
  });
});

export const paymentController = {
  createCheckoutSession,
  stripeWebhook,
  getMyPayments,
  getLandlordEarnings,
};
