import express from "express";
import { createDiscount, deleteDiscount, getAllDiscounts, getDiscountById, updateDiscount } from "../../controller/api/discountsController";
import { isAdminMiddleware } from "../../middleware/middleware";

export const discountsRouter = express.Router();

// Discounts
discountsRouter.get("/", getAllDiscounts);
discountsRouter.get("/:id", getDiscountById);
discountsRouter.post("/", isAdminMiddleware, createDiscount);
discountsRouter.put("/:id", isAdminMiddleware, updateDiscount);
discountsRouter.delete("/:id", isAdminMiddleware, deleteDiscount);