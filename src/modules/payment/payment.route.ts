import { Router } from "express";
import { Role } from "@prisma/client";

import auth from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/checkout",
  auth(Role.TENANT),
  paymentController.createCheckoutSession,
);

export const paymentRoutes = router;
