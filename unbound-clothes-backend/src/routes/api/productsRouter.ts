import express from "express";
import { isAdminMiddleware } from "../../middleware/middleware";
import { addDiscounts, createProduct, deleteProduct, getAllProducts, getProductById, removeDiscounts, restoreProduct, updateProduct } from "../../controller/api/productsController";

export const productsRouter = express.Router();

// Products
productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", getProductById);
productsRouter.post("/", isAdminMiddleware, createProduct);
productsRouter.put("/:id", isAdminMiddleware, updateProduct);
productsRouter.delete("/:id", isAdminMiddleware, deleteProduct);
productsRouter.put("/:id/restore", isAdminMiddleware, restoreProduct);

// Products Discounts
productsRouter.post("/:id/discounts", isAdminMiddleware, addDiscounts);
productsRouter.delete("/:id/discounts", isAdminMiddleware, removeDiscounts);