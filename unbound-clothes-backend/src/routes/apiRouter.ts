import express from "express";
import usersRouter from "./api/usersRouter";
import { authRouter } from "./api/auth/authRouter";
import { authMiddleware } from "../middleware/middleware";
import { uploadCloudinaryRouter } from "./api/cloudinaryRouter";
import { productsRouter } from "./api/productsRouter";
import { cartRouter } from "./api/cartRouter";
import { directionsRouter } from "./api/directionsRouter";
import { mercadoPagoRouter } from "./api/mercadoPagoRouter";
import { getCloudinaryController } from "../controller/api/cloudinaryController";
import { ordersRouter } from "./api/ordersRouter";

const apiRouter = express.Router();

// Routes
apiRouter.use("/users", authMiddleware, usersRouter);
apiRouter.use("/directions", authMiddleware, directionsRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/cart", authMiddleware, cartRouter);
apiRouter.use("/orders", authMiddleware, ordersRouter);

// Cloudinary
apiRouter.post("/cloudinary", getCloudinaryController);
apiRouter.use("/upload/cloudinary", uploadCloudinaryRouter);

// Mercadopago
apiRouter.use("/mp", mercadoPagoRouter);

// Auth
apiRouter.use("/auth", authRouter);

export default apiRouter;