import { Router } from "express";
import { Role } from "@prisma/client";

import auth from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/", auth(Role.ADMIN), categoryController.createCategory);

export const categoryRoutes = router;
