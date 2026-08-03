import { Router } from "express";

import auth from "../../middlewares/auth";
import { propertyController } from "./property.controller";
import { Role } from "@prisma/client";

const router = Router();

router.post("/", auth(Role.LANDLORD), propertyController.createProperty);

router.get("/", propertyController.getAllProperties);

router.get("/:id", propertyController.getSingleProperty);

router.patch("/:id", auth(Role.LANDLORD), propertyController.updateProperty);

export const propertyRoutes = router;
