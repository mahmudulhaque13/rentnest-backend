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

export const rentalRequestRoutes = router;
