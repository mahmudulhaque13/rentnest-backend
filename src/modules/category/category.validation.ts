import { z } from "zod";

const createCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(2, {
      message: "Category name must be at least 2 characters",
    }),
  }),
});

const updateCategoryValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, {
        message: "Category name must be at least 2 characters",
      })
      .optional(),
  }),
});

export const categoryValidation = {
  createCategoryValidation,
  updateCategoryValidation,
};
