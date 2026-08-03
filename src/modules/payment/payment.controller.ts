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

export const paymentController = {
  createCheckoutSession,
  stripeWebhook,
};
