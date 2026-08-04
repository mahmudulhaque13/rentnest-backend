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

router.get("/my-payments", auth(Role.TENANT), paymentController.getMyPayments);

router.get(
  "/earnings",
  auth(Role.LANDLORD),
  paymentController.getLandlordEarnings,
);

export const paymentRoutes = router;
