import express from "express";
import { createCart, getCartById, deleteCart, restoreCart, updateCart, purchaseProducts,  } from "../../controller/api/cartController";
import { isAdminMiddleware } from "../../middleware/middleware";

export const cartRouter = express.Router();

// Cart
cartRouter.get("/:id", getCartById);
cartRouter.post("/", createCart);
cartRouter.put("/:id", updateCart);
cartRouter.delete("/:id", isAdminMiddleware, deleteCart);
cartRouter.put("/:id/restore", isAdminMiddleware, restoreCart);

// Mercadopago
cartRouter.post("/:id", isAdminMiddleware, purchaseProducts);