import { Router } from "express";
import { Role } from "@prisma/client";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { reviewController } from "./review.controller";
import { reviewValidation } from "./review.validation";

const router = Router();

router.post(
  "/",
  auth(Role.TENANT),
  validateRequest(reviewValidation.createReviewValidation),
  reviewController.createReview,
);

router.get("/property/:propertyId", reviewController.getPropertyReviews);

router.patch(
  "/:id",
  auth(Role.TENANT),
  validateRequest(reviewValidation.updateReviewValidation),
  reviewController.updateReview,
);

router.delete("/:id", auth(Role.TENANT), reviewController.deleteReview);

export const reviewRoutes = router;
