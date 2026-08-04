import { Router } from "express";
import { Role } from "@prisma/client";

import auth from "../../middlewares/auth";
import { categoryController } from "./category.controller";
import validateRequest from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.createCategoryValidation),
  categoryController.createCategory,
);

router.get("/", categoryController.getAllCategories);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.updateCategoryValidation),
  categoryController.updateCategory,
);

router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;
