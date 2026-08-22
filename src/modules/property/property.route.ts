import { Router } from "express";
import { Role } from "@prisma/client";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { propertyController } from "./property.controller";
import { propertyValidation } from "./property.validation";

const router = Router();

router.post(
  "/",
  auth(Role.LANDLORD),
  validateRequest(propertyValidation.createPropertyValidation),
  propertyController.createProperty,
);

router.get("/", propertyController.getAllProperties);

router.get(
  "/my-properties",
  auth(Role.LANDLORD),
  propertyController.getMyProperties,
);

router.get("/:id", propertyController.getSingleProperty);

router.patch(
  "/:id/availability",
  auth(Role.LANDLORD),
  validateRequest(propertyValidation.updatePropertyAvailabilityValidation),
  propertyController.updatePropertyAvailability,
);

router.patch(
  "/:id",
  auth(Role.LANDLORD),
  validateRequest(propertyValidation.updatePropertyValidation),
  propertyController.updateProperty,
);

router.delete("/:id", auth(Role.LANDLORD), propertyController.deleteProperty);

export const propertyRoutes = router;
