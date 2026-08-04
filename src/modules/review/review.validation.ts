import { z } from "zod";

const createReviewValidation = z.object({
  body: z.object({
    propertyId: z.uuid({
      message: "Invalid property id",
    }),

    rating: z
      .number()
      .int()
      .min(1, {
        message: "Rating must be at least 1",
      })
      .max(5, {
        message: "Rating cannot be greater than 5",
      }),

    comment: z
      .string()
      .min(10, {
        message: "Comment must be at least 10 characters",
      })
      .max(500, {
        message: "Comment cannot exceed 500 characters",
      }),
  }),
});

const updateReviewValidation = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),

    comment: z.string().min(10).max(500).optional(),
  }),
});

export const reviewValidation = {
  createReviewValidation,
  updateReviewValidation,
};
