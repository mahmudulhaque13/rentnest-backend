import { z } from "zod";
import { UserStatus } from "@prisma/client";

const updateUserStatusValidation = z.object({
  body: z.object({
    status: z.nativeEnum(UserStatus),
  }),
});

export const adminValidation = {
  updateUserStatusValidation,
};
