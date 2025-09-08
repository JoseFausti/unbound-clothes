import { Request, Response } from "express";
import { cartModel } from "../../models/cart/cartModel";
import { ICart, ICreateCart } from "../../models/cart/cartModel.interface";
import { ErrorResponse } from "../../types/types";
import { userModel } from "../../models/user/userModel";
import { PaymentStatus, UserRole } from "@prisma/client";
import { productModel } from "../../models/products/productModel";
import prisma from "../../config/prisma";
import { IPreference, IUpdateCartItem } from "../../models/cart/cartItem/cartItemModel.interface";
import { mpPreference, mpPayment, portConfig } from "../../config/config";

// Cart
export const getCartById = async (req: Request, res: Response): Promise<Response<ICart | ErrorResponse>> => {
    try {
        const cartId = req.params.id;
        const cart = await cartModel.findUnique({ 
            where: { id: cartId },
            include: { cartItems: true }
        });
        if (cart && !cart.deleted) return res.status(200).json(cart);
        return res.status(404).json({ error: "Cart not found" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve cart" });
    }
}

export const createCart = async (req: Request, res: Response): Promise<Response<ICart | ErrorResponse>> => {
    try {
        const {userId}: ICreateCart = req.body;
        if (!userId) return res.status(400).json({ error: "User ID is required" });
        const user = await userModel.findUnique({ where: { id: userId } });
        if (!user || user.deleted || user.role !== UserRole.USER) return res.status(404).json({ error: "User not found" });

        const existingCart = await cartModel.findUnique({ where: { userId } });
        if (existingCart?.deleted) return res.status(400).json({ error: "User already has a deleted cart" });
        if (existingCart) return res.status(400).json({ error: "User already has a cart" });
        const newCart = await cartModel.create({ data: { userId }, include: { cartItems: true } });
        if (!newCart) throw new Error();
        return res.status(201).json(newCart);
    } catch (error) {
        return res.status(500).json({ error: "Failed to create cart" });
    }
}

export const updateCart = async (req: Request, res: Response): Promise<Response<ICart | ErrorResponse>> => {
    try {
        const cartId = req.params.id;
        const { cartItems }: { cartItems: IUpdateCartItem[] } = req.body;
        if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: "Cart items are required" });
        const cart = await cartModel.findUnique({ where: { id: cartId } });
        if (!cart || cart.deleted) return res.status(404).json({ error: "Cart not found" });
        
        const updateCartResult = await prisma.$transaction(async(prisma) => {

            for (const item of cartItems) {
                const product = await productModel.findUnique({ where: { id: item.productId } });
                if (!product || product.deleted ) throw new Error();
                if (product.stock < item.quantity) throw new Error();
            }

            await prisma.cartItem.deleteMany({ where: { cartId } });
            const updatedCartItems = await prisma.cartItem.createMany({
                data: cartItems.map((item) => ({
                    cartId,
                    productId: item.productId,
                    quantity: item.quantity
                })),
            });
            if (updatedCartItems.count !== cartItems.length) throw new Error();

            const updatedCart = await prisma.cart.findUnique({ 
                where: { id: cartId },
                include: { cartItems: true } 
            });
            if (!updatedCart) throw new Error();

            return updatedCart;
        })
        if (!updateCartResult) throw new Error();
        return res.status(200).json(updateCartResult);
    } catch (error) {
        return res.status(500).json({ error: "Failed to update cart" });
    }
}

export const deleteCart = async (req: Request, res: Response): Promise<Response<ICart | ErrorResponse>> => {
    try {
        const cartId = req.params.id;
        const cart = await cartModel.findUnique({ where: { id: cartId } });
        if (!cart || cart.deleted) return res.status(404).json({ error: "Cart not found" });
        const deletedCart = await cartModel.update({ 
            where: { id: cartId }, 
            data: { deleted: true }, 
            include: { cartItems: true } 
        });
        if (!deletedCart) throw new Error();
        return res.status(200).json(deletedCart);
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete cart" });
    }
}

export const restoreCart = async (req: Request, res: Response): Promise<Response<ICart | ErrorResponse>> => {
    try {
        const cartId = req.params.id;
        const cart = await cartModel.findUnique({ where: { id: cartId } });
        if (!cart || !cart.deleted) return res.status(404).json({ error: "Cart not found or not deleted" });
        const restoredCart = await cartModel.update({ 
            where: { id: cartId }, 
            data: { deleted: false }, 
            include: { cartItems: true } 
        });
        if (!restoredCart) throw new Error();
        return res.status(200).json(restoredCart);
    } catch (error) {
        return res.status(500).json({ error: "Failed to restore cart" });
    }
}

// Mercadopago
export const purchaseProducts = async (req: Request, res: Response): Promise<any> => {
    try {
        const cartId = req.params.id;
        const cart = await cartModel.findUnique({ where: { id: cartId }, include: { cartItems: true, user: true } });
        if (!cart || cart.deleted) return res.status(404).json({ error: "Cart not found" });
        
        const preference: {
            items: IPreference[];
            payer: { email: string };
        } = { items: [], payer: { email: "" } };
        
        for (const item of cart.cartItems) {
            const product = await productModel.findUnique({ where: { id: item.productId }, include: { discounts: true }});
            if (!product || product.deleted) throw new Error();
            if (product.stock < item.quantity) throw new Error();
            
            const finalPrice = product.discounts.length > 0
            ? Math.max(0, product.price - product.discounts.reduce((acc, discount) => ( acc + (product.price * discount.percentage / 100)), 0))
            : product.price;

            preference.items.push({
                id: product.id,
                title: product.name,
                description: product.description,
                picture_url: product.imageUrl,
                quantity: item.quantity,
                unit_price: finalPrice,
            });
            preference.payer.email = cart.user.email;
        }

        const buildPreference = await mpPreference.create({
            body: {
                items: preference.items.map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    picture_url: item.picture_url,
                    unit_price: item.unit_price,
                    quantity: item.quantity,
                })),
                payer: { email: preference.payer.email },
                metadata: { cartId },
                external_reference: cartId, // Bridge between preference and payment
                back_urls: {
                    success: `${portConfig.frontendUrl}/cart/success`,
                    failure: `${portConfig.frontendUrl}/cart/failure`,
                    pending: `${portConfig.frontendUrl}/cart/pending`,
                },
                auto_return: "approved",
                notification_url: `https://localhost:${portConfig.port}/api/mp/webhook`,
            }
        });

        if (!buildPreference) throw new Error();
        return res.status(200).json({
            id: buildPreference.id,
            init_point: buildPreference.init_point,
            sandbox_init_point: buildPreference.sandbox_init_point
        });

    } catch (error) {
        return res.status(500).json({ error: "Failed to create preference" });
    }
}

export const processWebhook = async (req: Request, res: Response): Promise<any> => {
    try {
        const {type, data} = req.body;
       
        // Payment nootification
        if (type !== "payment") return res.status(400).json({ error: "Invalid webhook type" });
        
        const paymentId = data.id;
        const paymentResponse = await mpPayment.get(paymentId);

        const cartId = paymentResponse.external_reference;
        const cart = await cartModel.findUnique({ where: { id: cartId }, include: { cartItems: true, user: true } });
        if (!cart || cart.deleted) return res.status(404).json({ error: "Cart not found" });
        if (cart.paymentStatus === PaymentStatus.APPROVED) return res.status(200).json({ message: "Webhook processed successfully" });
        
        const paymentStatus = paymentResponse.status;
        if (paymentStatus === "approved") {
            await prisma.$transaction(async(prisma) => {
                for (const item of cart.cartItems) {
                    const product = await prisma.product.findUnique({ where: { id: item.productId }});
                    const updatedProduct = await prisma.product.update({ 
                        where: { id: item.productId }, 
                        data: { stock:  product!.stock - item.quantity } 
                    });
                    if (!updatedProduct) throw new Error();
                }
                const updatedCart = await prisma.cart.update({ 
                    where: { id: cartId }, 
                    data: {
                        paymentStatus: PaymentStatus.APPROVED,
                    }
                });
                if (!updatedCart) throw new Error();  
            })
        }
        
        return res.sendStatus(200);
        
    } catch (error) {
        return res.status(500).json({ error: "Failed to process webhook" });
    }
}