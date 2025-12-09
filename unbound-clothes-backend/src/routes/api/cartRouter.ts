import express from "express";
import { createCart, deleteCart, getCartById, getCartByUserId, restoreCart, updateCart } from "../../controller/api/cartController";
import { isAdminMiddleware } from "../../middleware/middleware";

export const cartRouter = express.Router();

// Cart
cartRouter.get("/:id", getCartById);
cartRouter.get("/user/:userId", getCartByUserId);
cartRouter.post("/", createCart);
cartRouter.put("/:id", updateCart);
cartRouter.delete("/:id", isAdminMiddleware, deleteCart);
cartRouter.put("/:id/restore", isAdminMiddleware, restoreCart);

// Mailing
cartRouter.post("/:id/send-mail", getCartById);