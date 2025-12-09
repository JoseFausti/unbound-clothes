import { Request, Response } from "express";
import { productModel } from "../../models/products/productModel";
import { ICreateUpdateProduct, IProduct } from "../../models/products/productModel.interface";
import { ErrorResponse } from "../../types/types";
import { userModel } from "../../models/user/userModel";
import { ICreateUpdateDiscount, IDiscount } from "../../models/discounts/discountModel.interface";
import { Category, UserRole } from "@prisma/client";
import { ICreateUpdateProductVariant } from "../../models/products/variants/variantsModel.interface";
import prisma from "../../config/prisma";
import { validateSize } from "../../utils/functions";

export const getAllProducts = async (req: Request, res: Response): Promise<Response<IProduct[] | ErrorResponse>> => {
    try {
        const products = await productModel.findMany({
            where: { deleted: false },
            include: {
               seller: true,
               variants: true,
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
                variants: true,
                discounts: true
            }
        });
        if (product && !product.deleted) return res.status(200).json(product);
        return res.status(404).json({ error: "Product not found" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch product" });
    }
}

export const getAllProductsByUserId = async (req: Request, res: Response): Promise<Response<IProduct[] | ErrorResponse>> => {
    try {
        const userId = req.params.id;
        const products = await productModel.findMany({
            where: { sellerId: userId, deleted: false },
            include: {
                seller: true,
                variants: true,
                discounts: true
            }
        });
        if(!products) throw new Error();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch products by user" });
    }
}

export const createProduct = async (req: Request, res: Response): Promise<Response<IProduct | ErrorResponse>> => {
    try {
        const {...product}: ICreateUpdateProduct = req.body
        const {name, price, sellerId} = product
        if (!name || !price || !sellerId) return res.status(400).json({ error: "Missing required fields" });
        const seller = await userModel.findUnique({ where: { id: sellerId } });
        if (!seller || seller.deleted || seller.role !== UserRole.SELLER) return res.status(404).json({ error: "Seller not found" });
        const newProduct = await productModel.create({
            data: { ...product },
            include: { 
                seller: true,
                variants: true,
                discounts: true
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
        if (!seller || seller.deleted || seller.role !== UserRole.SELLER) return res.status(404).json({ error: "Seller not found" });
        const updatedProduct = await productModel.update({
            where: { id: productId },
            data: { 
                ...product,
                variants: { deleteMany: {} }
            },
            include: {
                seller: true,
                variants: true,
                discounts: true
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
                variants: true,
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
                variants: true,
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
    const { discounts }: { discounts: ICreateUpdateDiscount[] } = req.body;

    if (discounts.length === 0) {
        const deletedDiscounts = await prisma.discount.deleteMany({ where: { productId }});
        if (!deletedDiscounts) throw new Error();
        const updatedProduct = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                seller: true,
                variants: true,
                discounts: true,
            },
        })
        if (!updatedProduct) throw new Error();
        return res.status(200).json(updatedProduct);
    }

    discounts.forEach((discount) => { 
      if (
            discount.percentage > 100 || discount.percentage < 0 ||
            new Date(discount.startDate) >= new Date(discount.endDate)
        ) 
        throw new Error("Invalid discount data");
    });

    const product = await prisma.product.findUnique({ where: { id: productId }});
    if (!product || product.deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = await prisma.$transaction(async (tx) => {
        await tx.discount.deleteMany({ where: { productId }});
        await tx.discount.createMany({ 
            data: discounts.map((discount) => ({
                productId,
                percentage: discount.percentage,
                startDate: new Date(discount.startDate),
                endDate: new Date(discount.endDate),
            }))
        });

        return tx.product.findUnique({
            where: { id: productId },
            include: {
                seller: true,
                variants: true,
                discounts: true,
            },
        });
    });
    if (!updatedProduct) throw new Error();

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update discounts" });
  }
};

export const updateVariants = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const variants: ICreateUpdateProductVariant[] = req.body;

    if (!variants || variants.length === 0) 
      return res.status(400).json({ error: "Missing variants" });

    const variantIds = variants
        .map((v) => v.id)
        .filter((id) => id !== undefined);

    const product = await productModel.findUnique({ where: { id: productId } });
    if (!product || product.deleted) return res.status(404).json({ error: "Product not found" });

    const updatedProduct = await prisma.$transaction(async (prisma) => {

        await prisma.productVariant.deleteMany({ where: { productId, id: { notIn: variantIds } } });

        const category = product.category as Category;
        for (const variant of variants) {
            try {
                validateSize(category, variant.size);
            } catch (err: any) {
                throw new Error(`Invalid size for variant (${variant.color}, ${variant.size}): ${err.message}`);
            }

            await prisma.productVariant.upsert({
                where: { productId_color_size: { 
                    productId, 
                    color: variant.color, 
                    size: variant.size 
                }},
                update: { stock: variant.stock },
                create: { 
                    productId, 
                    color: variant.color, 
                    size: variant.size, 
                    stock: variant.stock 
                }
            });
        } 

        return prisma.product.findUnique({
            where: { id: productId },
            include: {
                seller: true,
                variants: true,
                discounts: true,
            },
        });
    });

    if (!updatedProduct) throw new Error();
    return res.status(200).json(updatedProduct);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update variants" });
  }
};