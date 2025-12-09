import express from "express";
import { isSellerMiddleware } from "../../middleware/middleware";
import { addDiscounts, createProduct, deleteProduct, getAllProducts, getAllProductsByUserId, getProductById, restoreProduct, updateProduct, updateVariants } from "../../controller/api/productsController";

export const productsRouter = express.Router();

// Products
productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", getProductById);
productsRouter.get("/user/:id", getAllProductsByUserId);
productsRouter.post("/", isSellerMiddleware, createProduct);
productsRouter.put("/:id", isSellerMiddleware, updateProduct);
productsRouter.delete("/:id", isSellerMiddleware, deleteProduct);
productsRouter.put("/:id/restore", isSellerMiddleware, restoreProduct);

// Products Discounts
productsRouter.put("/:id/discounts", isSellerMiddleware, addDiscounts);

// Product Variants
productsRouter.put("/:id/variants", isSellerMiddleware, updateVariants);