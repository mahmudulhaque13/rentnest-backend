import { Router } from "express";
import { Role } from "@prisma/client";

import auth from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/", auth(Role.ADMIN), categoryController.createCategory);

router.get("/", categoryController.getAllCategories);

router.patch("/:id", auth(Role.ADMIN), categoryController.updateCategory);

router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;
