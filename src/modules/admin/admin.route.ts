import { Router } from "express";
import { Role } from "@prisma/client";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { adminController } from "./admin.controller";
import { adminValidation } from "./admin.validation";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  validateRequest(adminValidation.updateUserStatusValidation),
  adminController.updateUserStatus,
);

router.get("/properties", auth(Role.ADMIN), adminController.getAllProperties);

router.get(
  "/rental-requests",
  auth(Role.ADMIN),
  adminController.getAllRentalRequests,
);

export const adminRoutes = router;
