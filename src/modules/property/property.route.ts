import { Router } from "express";

import auth from "../../middlewares/auth";
import { propertyController } from "./property.controller";
import { Role } from "@prisma/client";

const router = Router();

router.post("/", auth(Role.LANDLORD), propertyController.createProperty);

router.get("/", propertyController.getAllProperties);

export const propertyRoutes = router;
