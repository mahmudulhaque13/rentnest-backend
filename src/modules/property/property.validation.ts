import { z } from "zod";

const createPropertyValidation = z.object({
  body: z.object({
    title: z.string().min(3, {
      message: "Title must be at least 3 characters",
    }),

    description: z.string().min(10, {
      message: "Description must be at least 10 characters",
    }),

    rent: z.number().positive({
      message: "Rent must be greater than 0",
    }),

    bedrooms: z.number().int().min(1, {
      message: "Bedrooms must be at least 1",
    }),

    bathrooms: z.number().int().min(1, {
      message: "Bathrooms must be at least 1",
    }),

    address: z.string().min(3, {
      message: "Address is required",
    }),

    city: z.string().min(2, {
      message: "City is required",
    }),

    district: z.string().min(2, {
      message: "District is required",
    }),

    images: z.array(z.url()).min(1, {
      message: "At least one image is required",
    }),

    amenities: z.array(z.string()).optional(),

    categoryId: z.uuid({
      message: "Invalid category id",
    }),
  }),
});

const updatePropertyValidation = z.object({
  body: z.object({
    title: z.string().min(3).optional(),

    description: z.string().min(10).optional(),

    rent: z.number().positive().optional(),

    bedrooms: z.number().int().min(1).optional(),

    bathrooms: z.number().int().min(1).optional(),

    address: z.string().optional(),

    city: z.string().optional(),

    district: z.string().optional(),

    images: z.array(z.url()).optional(),

    amenities: z.array(z.string()).optional(),

    categoryId: z.uuid().optional(),
  }),
});

export const propertyValidation = {
  createPropertyValidation,
  updatePropertyValidation,
};
