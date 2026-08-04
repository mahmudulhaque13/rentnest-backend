import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(authValidation.registerValidation),
  authController.registerUser,
);

router.post(
  "/login",
  validateRequest(authValidation.loginValidation),
  authController.loginUser,
);
router.get("/me", auth(), authController.getMe);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

export const authRoutes = router;
