import { z } from "zod";

const registerValidation = z.object({
  name: z.string().min(2).max(50),

  email: z.email(),

  password: z.string().min(6),

  phone: z.string(),

  role: z.enum(["TENANT", "LANDLORD"]),
});

const loginValidation = z.object({
  email: z.email(),

  password: z.string().min(6),
});

export const authValidation = {
  registerValidation,
  loginValidation,
};
