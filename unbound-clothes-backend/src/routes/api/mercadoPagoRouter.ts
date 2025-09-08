import express from "express";
import { authMiddleware } from "../../middleware/middleware";
import { processWebhook, purchaseProducts } from "../../controller/api/cartController";

export const mercadoPagoRouter = express.Router();

mercadoPagoRouter.post("/:cartId", authMiddleware, purchaseProducts);
mercadoPagoRouter.post("/webhook", authMiddleware, processWebhook);