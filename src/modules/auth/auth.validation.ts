import { z } from "zod";
import { Role } from "@prisma/client";

const registerValidation = z.object({
  body: z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters",
    }),

    email: z.email({
      message: "Invalid email address",
    }),

    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),

    phone: z.string().optional(),

    role: z.enum(Role).optional(),
  }),
});

const loginValidation = z.object({
  body: z.object({
    email: z.email({
      message: "Invalid email address",
    }),

    password: z.string().min(1, {
      message: "Password is required",
    }),
  }),
});

const refreshTokenValidation = z.object({
  body: z.object({
    refreshToken: z.string().min(1, {
      message: "Refresh token is required",
    }),
  }),
});

export const authValidation = {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
};
