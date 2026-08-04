import { z } from "zod";

const createCheckoutSessionValidation = z.object({
  body: z.object({
    rentalRequestId: z.uuid({
      message: "Invalid rental request id",
    }),
  }),
});

export const paymentValidation = {
  createCheckoutSessionValidation,
};
