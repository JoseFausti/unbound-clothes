import express from "express";
import { authMiddleware } from "../../middleware/middleware";
import { createMercadopagoPreference, processPayment, processWebhook } from "../../controller/api/cartController";

export const 
mercadoPagoRouter = express.Router();

mercadoPagoRouter.post("/process_payment", processPayment);
mercadoPagoRouter.post("/webhook", processWebhook);
mercadoPagoRouter.post("/:cartId", authMiddleware, createMercadopagoPreference);