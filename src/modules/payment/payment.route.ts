import { Router } from "express";
import { Role } from "@prisma/client";

import auth from "../../middlewares/auth";
import { paymentController } from "./payment.controller";
import validateRequest from "../../middlewares/validateRequest";
import { paymentValidation } from "./payment.validation";

const router = Router();

router.post(
  "/checkout",
  auth(Role.TENANT),
  validateRequest(paymentValidation.createCheckoutSessionValidation),
  paymentController.createCheckoutSession,
);

router.get("/my-payments", auth(Role.TENANT), paymentController.getMyPayments);

router.get(
  "/earnings",
  auth(Role.LANDLORD),
  paymentController.getLandlordEarnings,
);

export const paymentRoutes = router;
