import { Router } from "express";
import { Role } from "@prisma/client";

import auth from "../../middlewares/auth";
import { rentalRequestController } from "./rentalRequest.controller";

const router = Router();

router.post(
  "/",
  auth(Role.TENANT),
  rentalRequestController.createRentalRequest,
);

router.get(
  "/my-requests",
  auth(Role.TENANT),
  rentalRequestController.getMyRentalRequests,
);

router.get(
  "/landlord",
  auth(Role.LANDLORD),
  rentalRequestController.getLandlordRentalRequests,
);

export const rentalRequestRoutes = router;
