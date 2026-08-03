import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRoutes } from "./modules/auth/auth.route";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import { propertyRoutes } from "./modules/property/property.route";
import { categoryRoutes } from "./modules/category/category.route";

const app: Application = express();

// Middlewares
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "RentNest API Running Successfully",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/categories", categoryRoutes);

// 404 Route Handler
app.use(notFound);

// Global Error Handler (সবসময় একদম শেষে থাকবে)
app.use(globalErrorHandler);

export default app;
