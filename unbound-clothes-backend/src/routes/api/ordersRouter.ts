
import express from "express";
import { isAdminMiddleware } from "../../middleware/middleware";
import { createOrderFromCart, deleteHistoryOrderByUser, deleteOrder, getAllOrders, getOrderById, getOrdersByUser, getSoldItems, restoreOrder, updateShippingStatus } from "../../controller/api/ordersController";

export const ordersRouter = express.Router();

ordersRouter.get("/", isAdminMiddleware, getAllOrders);
ordersRouter.get("/:id", isAdminMiddleware, getOrderById);
ordersRouter.get("/user/:userId", getOrdersByUser);
ordersRouter.get("/user/:userId/sold", getSoldItems);
ordersRouter.post("/", isAdminMiddleware, createOrderFromCart);
ordersRouter.put("/:id", updateShippingStatus);
ordersRouter.delete("/user/:id", deleteHistoryOrderByUser);
ordersRouter.delete("/:id", deleteOrder);
ordersRouter.put("/:id/restore", isAdminMiddleware, restoreOrder);