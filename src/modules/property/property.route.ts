import { Router } from "express";

import auth from "../../middlewares/auth";
import { propertyController } from "./property.controller";
import { Role } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
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
  "/:id",
  auth(Role.LANDLORD),
  validateRequest(propertyValidation.updatePropertyValidation),
  propertyController.updateProperty,
);

router.delete("/:id", auth(Role.LANDLORD), propertyController.deleteProperty);

export const propertyRoutes = router;
