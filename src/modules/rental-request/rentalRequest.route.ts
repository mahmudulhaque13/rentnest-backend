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

router.patch(
  "/:id/approve",
  auth(Role.LANDLORD),
  rentalRequestController.approveRentalRequest,
);

router.patch(
  "/:id/reject",
  auth(Role.LANDLORD),
  rentalRequestController.rejectRentalRequest,
);

router.delete(
  "/:id",
  auth(Role.TENANT),
  rentalRequestController.cancelRentalRequest,
);

export const rentalRequestRoutes = router;
