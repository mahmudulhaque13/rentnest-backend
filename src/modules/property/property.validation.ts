import { z } from "zod";

const createPropertyValidation = z.object({
  body: z.object({
    title: z.string().min(3),

    description: z.string().min(10),

    rent: z.number().positive(),

    bedrooms: z.number().int().min(1),

    bathrooms: z.number().int().min(1),

    address: z.string(),

    city: z.string(),

    district: z.string(),

    images: z.array(z.url()),

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

const updatePropertyAvailabilityValidation = z.object({
  body: z.object({
    status: z.enum(["AVAILABLE", "UNAVAILABLE"]),
  }),
});

export const propertyValidation = {
  createPropertyValidation,
  updatePropertyValidation,
  updatePropertyAvailabilityValidation,
};
