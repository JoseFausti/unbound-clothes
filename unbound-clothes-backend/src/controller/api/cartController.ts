import { Request, Response } from "express";
import { cartModel } from "../../models/cart/cartModel";
import { ICart, ICartWithProducts, ICreateCart } from "../../models/cart/cartModel.interface";
import { ErrorResponse } from "../../types/types";
import { userModel } from "../../models/user/userModel";
import { PaymentStatus, UserRole } from "@prisma/client";
import prisma from "../../config/prisma";
import { IPreference, IUpdateCartItem } from "../../models/cart/cartItem/cartItemModel.interface";
import { mpPreference, mpPayment, portConfig } from "../../config/config";
import { variantModel } from "../../models/products/variants/variantsModel";
import { cartItemModel } from "../../models/cart/cartItem/cartItemModel";
import { sendEmail } from "../../utils/mailer";
import { createOrderFromCart } from "./ordersController";
import { directionModel } from "../../models/directions/directionsModel";
import { createOrderFromCartInternal } from "../../utils/controller/order";

// Cart
export const getCartById = async (req: Request, res: Response): Promise<Response<ICartWithProducts | ErrorResponse>> => {
    try {
        const cartId = req.params.id;
        const cart = await cartModel.findUnique({ 
            where: { id: cartId },
            include: { 
                cartItems: {
                    include: { 
                        variant: {
                            include: { product: { include: { discounts: true } } }
                        }
                    }
                }
            }
        });
        if (cart && !cart.deleted) return res.status(200).json(cart);
        return res.status(404).json({ error: "Cart not found" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve cart" });
    }
}

export const getCartByUserId = async (req: Request, res: Response): Promise<Response<ICartWithProducts | ErrorResponse>> => {
    try {
        const { userId } = req.params;
        const cart = await cartModel.findUnique({ 
            where: { userId },
            include: { 
                cartItems: {
                    include: { 
                        variant: {
                            include: { product: { include: { discounts: true } } }
                        }
                    }
                }
            }
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

export const updateCart = async (req: Request, res: Response): Promise<Response<ICartWithProducts | ErrorResponse>> => {
    try {
        const cartId = req.params.id;
        const { cartItems }: { cartItems: IUpdateCartItem[] } = req.body;
        if (!cartItems || !Array.isArray(cartItems)) return res.status(400).json({ error: "Cart items must be an array" });
        
        const cart = await cartModel.findUnique({ where: { id: cartId } });
        if (!cart || cart.deleted) return res.status(404).json({ error: "Cart not found" });
        
        // If cartItems is empty, delete all cart items
        if (cartItems.length === 0) {
            const deletedCartItems = await cartItemModel.deleteMany({ where: { cartId } });
            if (!deletedCartItems) throw new Error();

            const updatedCart = await prisma.cart.findUnique({ 
                where: { id: cartId },
                include: { 
                    cartItems: {
                        include: { 
                            variant: {
                                include: { product: { include: { discounts: true } } }
                            }
                        }
                    }
                }
            });
            if (!updatedCart) throw new Error();

            return res.status(200).json(updatedCart);
        }
        
        const updateCartResult = await prisma.$transaction(async(prisma) => {
            for (const item of cartItems) {
                const variant = await variantModel.findUnique({ where: { id: item.variantId } });
                if (!variant) throw new Error();
                if (variant.stock < item.quantity) throw new Error();
            }

            // 1)_ deleteMany + createMany: simple, clean table, not efficient, causes visual duplicates
            /* 
                await prisma.cartItem.deleteMany({ where: { cartId } });
                const updatedCartItems = await prisma.cartItem.createMany({
                    data: cartItems.map((item) => ({
                        cartId,
                        variantId: item.variantId,
                        quantity: item.quantity
                    })),
                });
                if (updatedCartItems.count !== cartItems.length) throw new Error();
            */

            // 2)_ deleteMany + upsert: Efficient, concistent, no visual duplicates, keep IDs
            await prisma.cartItem.deleteMany({ where: { cartId, variantId: { notIn: cartItems.map((item) => item.variantId) } } });

            for (const item of cartItems) {
                await prisma.cartItem.upsert({
                    where: {cartId_variantId: {cartId, variantId: item.variantId}},
                    update: { quantity: item.quantity },
                    create: { cartId, variantId: item.variantId, quantity: item.quantity },
                })
            }     

            const updatedCart = await prisma.cart.findUnique({ 
                where: { id: cartId },
                include: { 
                    cartItems: {
                        include: { 
                            variant: {
                                include: { product: { include: { discounts: true } } }
                            }
                        }
                    }
                }
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
export const createMercadopagoPreference = async (req: Request, res: Response): Promise<any> => {
    try {
        const cartId = req.params.cartId;
        const {directionId, shippingCost} = req.body;

        const cart = await cartModel.findUnique({ where: { id: cartId }, include: { cartItems: true, user: true } });
        if (!cart || cart.deleted) return res.status(404).json({ error: "Cart not found" });

        const direction = await directionModel.findUnique({ where: { id: directionId } });
        if (!direction || direction.deleted) return res.status(404).json({ error: "Direction not found" });
        
        const preference: {
            items: IPreference[];
            payer: { email: string };
        } = { items: [], payer: { email: "" } };
        
        for (const item of cart.cartItems) {
            const variant = await variantModel.findUnique({ where: { id: item.variantId }, include: { product: { include: { discounts: true } } }});
            if (!variant) throw new Error();
            if (variant.stock < item.quantity) throw new Error();
            
            const finalPrice = variant.product.discounts.length > 0
            ? Math.max(0, variant.product.price - variant.product.discounts.reduce((acc, discount) => ( acc + (variant.product.price * discount.percentage / 100)), 0))
            : variant.product.price;

            preference.items.push({
                id: variant.product.id,
                title: variant.product.name,
                description: variant.product.description,
                picture_url: variant.product.imageUrl,
                quantity: item.quantity,
                unit_price: finalPrice,
            });
            preference.payer.email = cart.user.email;
        }

        const buildPreference = await mpPreference.create({
            body: {
                purpose: "onboarding_credits", // Only registered users can buy. Credit pay preselected
                items: preference.items.map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    picture_url: item.picture_url,
                    unit_price: item.unit_price,
                    quantity: item.quantity,
                })),
                payer: { email: preference.payer.email },
                metadata: { 
                    cartId,
                    directionId,
                    shippingCost
                 },
                external_reference: cartId, // Bridge between preference and payment

                // back_urls: {
                //     success: `${portConfig.frontendUrl}/cart?result=success`,
                //     failure: `${portConfig.frontendUrl}/cart?result=failure`,
                //     pending: `${portConfig.frontendUrl}/cart?result=pending`,
                // },
                // auto_return: "approved",
                // notification_url: `https://localhost:${portConfig.port}/api/mp/webhook`, // Not available to localhost
            }
        });

        if (!buildPreference) throw new Error();
        return res.status(200).json({
            id: buildPreference.id,
            // init_point: buildPreference.init_point,
            // sandbox_init_point: buildPreference.sandbox_init_point
        });

    } catch (error) {
        return res.status(500).json({ error: "Failed to create preference" });
    }
}

export const processPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
        cartId, 
        directionId, 
        shippingCost,
        formData 
    } = req.body;

    const cart = await cartModel.findUnique({ where: { id: cartId }, include: { cartItems: true, user: true } });
    if (!cart || cart.deleted) return res.status(404).json({ error: "Cart not found" });

    const payment = await mpPayment.create({
        body: {
            ...formData,
            notification_url: `https://martina-unresounded-unharmonically.ngrok-free.dev/api/mp/webhook`,
        },
    });
    if (!payment) throw new Error();
    
    const updatedCart = await prisma.cart.update({
      where: { id: cartId },
      data: { paymentStatus: payment.status?.toUpperCase() as PaymentStatus },
    });
    if (!updatedCart) throw new Error();

    // DEVELOPMENT: Logic to process payment here.
    if (updatedCart.paymentStatus === PaymentStatus.APPROVED) await createOrderFromCartInternal({ cartId, directionId, shippingCost });
    if (updatedCart.paymentStatus === PaymentStatus.REJECTED) await sendEmail(cart.user.email, "Pago rechazado", "Tu pago fue rechazado ❌");

    return res.status(200).json(payment);
  } catch (error: any) {
    console.error("Error processing payment:", error.response || error);
    return res.status(500).json({ error: "Failed to process payment" });
  }
};

export const processWebhook = async (req: Request, res: Response): Promise<any> => {
    try {
        const {type, data} = req.body;
       
        // Payment nootification
        if (type !== "payment") return res.status(400).json({ error: "Invalid webhook type" });
        
        // PRODUCCTION: Logic to process payment here.

        // const paymentId = data.id;
        // const paymentResponse = await mpPayment.get(paymentId);

        // const status = paymentResponse.status?.toUpperCase() as PaymentStatus;

        // const cartId = paymentResponse.external_reference;
        // if (!cartId) return res.status(400).json({ error: "Missing cartId in external_reference" });

        // const directionId = paymentResponse.metadata?.directionId;
        // const shippingCost = paymentResponse.metadata?.shippingCost as number || 0;
        
        // const cart = await cartModel.findUnique({ where: { id: cartId }, include: { cartItems: true, user: true } });
        // if (!cart || cart.deleted) return res.status(404).json({ error: "Cart not found" });
        
        // // Update cart status
        // const updatedCart = await prisma.cart.update({where: { id: cartId }, data: { paymentStatus: status }});
        // if (!updatedCart) throw new Error();

        // if (status === PaymentStatus.APPROVED) await createOrderFromCartInternal({ cartId, directionId, shippingCost });
        // if (status === PaymentStatus.REJECTED) await sendEmail(cart.user.email, "Pago rechazado", "Tu pago fue rechazado ❌");
        
        return res.sendStatus(200);
    } catch (error) {
        console.log("Error processing webhook:", error);
        return res.status(500).json({ error: "Failed to process webhook" });
    }
}