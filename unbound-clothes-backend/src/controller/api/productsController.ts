import { Request, Response } from "express";
import { productModel } from "../../models/products/productModel";
import { ICreateUpdateProduct, IProduct } from "../../models/products/productModel.interface";
import { connectIds, disconnectIds } from "../../utils/functions";
import { discountModel } from "../../models/discounts/discountModel";
import { ErrorResponse } from "../../types/types";
import { userModel } from "../../models/user/userModel";
import { IDiscount } from "../../models/discounts/discountModel.interface";

export const getAllProducts = async (req: Request, res: Response): Promise<Response<IProduct[] | ErrorResponse>> => {
    try {
        const products = await productModel.findMany({
            where: { deleted: false },
            include: {
               seller: true,
               discounts: true 
            }
        });
        if(!products) throw new Error();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch products" });
    }
}

export const getProductById = async (req: Request, res: Response): Promise<Response<IProduct | ErrorResponse>> => {
    try {
        const productId = req.params.id;
        const product = await productModel.findUnique({
            where: { id: productId },
            include: {
                seller: true,
                discounts: true
            }
        });
        if (product && !product.deleted) return res.status(200).json(product);
        return res.status(404).json({ error: "Product not found" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch product" });
    }
}

export const createProduct = async (req: Request, res: Response): Promise<Response<IProduct | ErrorResponse>> => {
    try {
        const {...product}: ICreateUpdateProduct = req.body
        const {name, price, category, sellerId} = product
        if (!name || !price || !sellerId) return res.status(400).json({ error: "Missing required fields" });
        const seller = await userModel.findUnique({ where: { id: sellerId } });
        if (!seller || seller.deleted) return res.status(404).json({ error: "Seller not found" });
        const newProduct = await productModel.create({
            data: { ...product },
            include: {
                seller: true,
                discounts: true,
            }
        });
        if (!newProduct) throw new Error();
        return res.status(201).json(newProduct);
    } catch (error) {
        return res.status(500).json({ error: "Failed to create product" });
    }
}

export const updateProduct = async (req: Request, res: Response): Promise<Response<IProduct | ErrorResponse>> => {
    try {
        const productId = req.params.id;
        const {...product}: ICreateUpdateProduct = req.body
        const {name, price, sellerId} = product
        if (!name || !price || !sellerId) return res.status(400).json({ error: "Missing required fields" });
        const seller = await userModel.findUnique({ where: { id: sellerId } });
        if (!seller || seller.deleted) return res.status(404).json({ error: "Seller not found" });
        const updatedProduct = await productModel.update({
            where: { id: productId },
            data: { ...product },
            include: {
                seller: true,
                discounts: true,
            }
        });
        if (!updatedProduct) throw new Error();
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ error: "Failed to update product" });
    }
}

export const deleteProduct = async (req: Request, res: Response): Promise<Response< IProduct | ErrorResponse>> => {
    try {
        const productId = req.params.id;
        const product = await productModel.findUnique({ where: { id: productId } });
        if (!product || product.deleted) return res.status(404).json({ error: "Product not found" });
        const deletedProduct = await productModel.update({
            where: { id: productId },
            data: { deleted: true },
            include: {
                seller: true,
                discounts: true
            }
        });
        if (!deletedProduct) throw new Error();
        return res.status(200).json(deletedProduct);
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete product" });
    }
}

export const restoreProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product = await productModel.findUnique({ where: { id: productId } });
        if (!product || !product.deleted) return res.status(404).json({ error: "Product not found or not deleted" });
        const restoredProduct = await productModel.update({
            where: { id: productId },
            data: { deleted: false },
            include: {
                seller: true,
                discounts: true
            }
        });
        if (!restoredProduct) throw new Error();
        return res.status(200).json(restoredProduct);
    } catch (error) {
        return res.status(500).json({ error: "Failed to restore product" });
    }
}

export const addDiscounts = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const {discounts} = req.body;
        if (!discounts || discounts.length === 0) return res.status(400).json({ error: "Missing discounts" });
        const discountIds = discounts.map((d: IDiscount) => d.id);
        const discountsToAdd = await discountModel.findMany({ where: { id: { in: discountIds } } });
        if (!discountsToAdd || discountsToAdd.length !== discounts.length ) return res.status(404).json({ error: "Discounts not found" });
        const product = await productModel.findUnique({ where: { id: productId } });
        if (!product || product.deleted) return res.status(404).json({ error: "Product not found" });
        const updatedProduct = await productModel.update({
            where: { id: productId },
            data: {
                discounts: connectIds(discountsToAdd)
            },
            include: {
                seller: true,
                discounts: true
            }
        });
        if (!updatedProduct) throw new Error();
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ error: "Failed to add discounts" });
    }
}

export const removeDiscounts = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const {discounts} = req.body;
        if (!discounts || discounts.length === 0) return res.status(400).json({ error: "Missing discounts" });
        const discountIds = discounts.map((d: IDiscount) => d.id);
        const discountsToRemove = await discountModel.findMany({ where: { id: { in: discountIds } } });
        if (!discountsToRemove || discountsToRemove.length !== discounts.length) return res.status(404).json({ error: "Discounts not found" });
        const product = await productModel.findUnique({ where: { id: productId } });
        if (!product || product.deleted) return res.status(404).json({ error: "Product not found" });
        const updatedProduct = await productModel.update({
            where: { id: productId },
            data: {
                discounts: disconnectIds(discountsToRemove)
            },
            include: {
                seller: true,
                discounts: true
            }
        });
        if (!updatedProduct) throw new Error();
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ error: "Failed to remove discounts" });
    }
}