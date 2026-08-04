import { z } from "zod";

const createRentalRequestValidation = z.object({
  body: z.object({
    propertyId: z.uuid({
      message: "Invalid property id",
    }),

    moveInDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Invalid move in date",
    }),

    message: z
      .string()
      .min(10, {
        message: "Message must be at least 10 characters",
      })
      .max(500, {
        message: "Message cannot exceed 500 characters",
      }),
  }),
});

const updateRentalRequestValidation = z.object({
  body: z.object({
    moveInDate: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "Invalid move in date",
      })
      .optional(),

    message: z
      .string()
      .min(10, {
        message: "Message must be at least 10 characters",
      })
      .max(500, {
        message: "Message cannot exceed 500 characters",
      })
      .optional(),
  }),
});

export const rentalRequestValidation = {
  createRentalRequestValidation,
  updateRentalRequestValidation,
};
