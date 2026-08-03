import httpStatus from "http-status";
import {
  PaymentProvider,
  PaymentStatus,
  RentalStatus,
  PropertyStatus,
} from "@prisma/client";

import { Request } from "express";
import Stripe from "stripe";

import prisma from "../../lib/prisma";
import stripe from "../../lib/stripe";
import config from "../../config";
import AppError from "../../utils/appError";

import { ICreateCheckoutSession } from "./payment.interface";

const createCheckoutSession = async (
  tenantId: string,
  payload: ICreateCheckoutSession,
) => {
  // Find Rental Request
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: payload.rentalRequestId,
    },
    include: {
      property: true,
    },
  });

  // Rental Request Exists?
  if (!rentalRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  // Owner Check
  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  // Approved Check
  if (rentalRequest.status !== RentalStatus.APPROVED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental request is not approved",
    );
  }

  // Existing Payment Check
  const existingPayment = await prisma.payment.findUnique({
    where: {
      rentalRequestId: rentalRequest.id,
    },
  });

  if (existingPayment?.status === PaymentStatus.PAID) {
    throw new AppError(httpStatus.CONFLICT, "Payment already completed");
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",

          product_data: {
            name: rentalRequest.property.title,
          },

          unit_amount: rentalRequest.property.rent * 100,
        },

        quantity: 1,
      },
    ],

    success_url: `${config.appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.appUrl}/payment/cancel`,

    metadata: {
      rentalRequestId: rentalRequest.id,
      tenantId,
      propertyId: rentalRequest.property.id,
    },
  });

  // Payment Already Exists?
  if (existingPayment) {
    await prisma.payment.update({
      where: {
        id: existingPayment.id,
      },
      data: {
        transactionId: session.id,
        status: PaymentStatus.PENDING,
      },
    });
  } else {
    // Create Payment
    await prisma.payment.create({
      data: {
        amount: rentalRequest.property.rent,

        transactionId: session.id,

        provider: PaymentProvider.STRIPE,

        status: PaymentStatus.PENDING,

        rentalRequestId: rentalRequest.id,
      },
    });
  }

  // Return Checkout Session
  return {
    sessionId: session.id,
    checkoutUrl: session.url,
  };
};

const stripeWebhook = async (req: Request) => {
  const signature = req.headers["stripe-signature"] as string;

  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    config.stripeWebhookSecret,
  );

  // Ignore other events
  if (event.type !== "checkout.session.completed") {
    return {
      received: true,
    };
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const rentalRequestId = session.metadata?.rentalRequestId;
  const propertyId = session.metadata?.propertyId;

  if (!rentalRequestId || !propertyId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid webhook metadata");
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        rentalRequestId,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentIntentId: session.payment_intent as string,
        paidAt: new Date(),
      },
    });

    await tx.property.update({
      where: {
        id: propertyId,
      },
      data: {
        status: PropertyStatus.RENTED,
      },
    });
  });

  return {
    received: true,
  };
};

export const paymentService = {
  createCheckoutSession,
  stripeWebhook,
};
