import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", auth(), authController.getMe);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

export const authRoutes = router;
