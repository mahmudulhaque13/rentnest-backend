import httpStatus from "http-status";
import prisma from "../../lib/prisma";
import AppError from "../../utils/appError";

import { PaymentStatus } from "@prisma/client";
import { ICreateReview, IUpdateReview } from "./review.interface";

const createReview = async (tenantId: string, payload: ICreateReview) => {
  // Property Exists?
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
      isDeleted: false,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  // Payment Completed?
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

  // Calculate Average Rating
  const reviews = await prisma.review.findMany({
    where: {
      propertyId: payload.propertyId,
    },
  });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

  const averageRating = totalRating / reviews.length;

  // Update Property Rating
  await prisma.property.update({
    where: {
      id: payload.propertyId,
    },
    data: {
      averageRating,
    },
  });

  return review;
};

const getPropertyReviews = async (propertyId: string) => {
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

  const reviews = await prisma.review.findMany({
    where: {
      propertyId: review.propertyId,
    },
  });

  const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);

  await prisma.property.update({
    where: {
      id: review.propertyId,
    },
    data: {
      averageRating: totalRating / reviews.length,
    },
  });

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

  const reviews = await prisma.review.findMany({
    where: {
      propertyId: review.propertyId,
    },
  });

  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;

  await prisma.property.update({
    where: {
      id: review.propertyId,
    },
    data: {
      averageRating,
    },
  });

  return null;
};

export const reviewService = {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
};
