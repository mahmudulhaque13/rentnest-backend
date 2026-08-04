import httpStatus from "http-status";
import { PaymentStatus } from "@prisma/client";

import prisma from "../../lib/prisma";
import AppError from "../../utils/appError";

import { ICreateReview, IUpdateReview } from "./review.interface";

const updatePropertyAverageRating = async (propertyId: string) => {
  const result = await prisma.review.aggregate({
    where: {
      propertyId,
    },
    _avg: {
      rating: true,
    },
  });

  await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: {
      averageRating: result._avg.rating ?? 0,
    },
  });
};

const createReview = async (tenantId: string, payload: ICreateReview) => {
  // Check Property
  const property = await prisma.property.findFirst({
    where: {
      id: payload.propertyId,
      isDeleted: false,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  // Check Payment
  const payment = await prisma.payment.findFirst({
    where: {
      status: PaymentStatus.PAID,
      rentalRequest: {
        tenantId,
        propertyId: payload.propertyId,
      },
    },
  });

  if (!payment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You must complete payment before reviewing this property",
    );
  }

  // Already Reviewed?
  const existingReview = await prisma.review.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already reviewed this property",
    );
  }

  // Create Review
  const review = await prisma.review.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  // Update Average Rating
  await updatePropertyAverageRating(payload.propertyId);

  return review;
};

const getPropertyReviews = async (propertyId: string) => {
  // Check Property
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      isDeleted: false,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  const reviews = await prisma.review.findMany({
    where: {
      propertyId,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const updateReview = async (
  tenantId: string,
  reviewId: string,
  payload: IUpdateReview,
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  if (review.tenantId !== tenantId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  const updatedReview = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: payload,
  });

  // Update Average Rating
  await updatePropertyAverageRating(review.propertyId);

  return updatedReview;
};

const deleteReview = async (tenantId: string, reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  if (review.tenantId !== tenantId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  // Update Average Rating
  await updatePropertyAverageRating(review.propertyId);

  return null;
};

export const reviewService = {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
};
