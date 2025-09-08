import express from "express";
import usersRouter from "./api/usersRouter";
import { authRouter } from "./api/auth/authRouter";
import { authMiddleware } from "../middleware/middleware";
import { uploadCloudinaryRouter } from "./api/cloudinaryRouter";
import { productsRouter } from "./api/productsRouter";
import { cartRouter } from "./api/cartRouter";
import { directionsRouter } from "./api/directionsRouter";
import { discountsRouter } from "./api/discountsRouter";
import { mercadoPagoRouter } from "./api/mercadoPagoRouter";

const apiRouter = express.Router();

// Routes
apiRouter.use("/users", usersRouter);
apiRouter.use("/directions", directionsRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/discounts", discountsRouter);
apiRouter.use("/cart", cartRouter);

// Cloudinary
apiRouter.use("/upload/cloudinary", uploadCloudinaryRouter);

// Mercadopago
apiRouter.use("/mp", authMiddleware, mercadoPagoRouter);

export default apiRouter;