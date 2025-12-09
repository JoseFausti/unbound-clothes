import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { ShippingStatus } from "@prisma/client";
import { createOrderFromCartInternal } from "../../utils/controller/order";
import { IProduct } from "../../models/products/productModel.interface";
import { ErrorResponse } from "../../types/types";
import { IProductVariant } from "../../models/products/variants/variantsModel.interface";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { variant: { include: { product: { include: { seller: true } } } } } },
        direction: true,
        shippingDetail: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const createOrderFromCart = async (req: Request, res: Response) => {
  try {
    const order = await createOrderFromCartInternal(req.body);
    return res.status(201).json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to create order" });
  }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.deleted) return res.status(404).json({ error: "User not found" });

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { variant: { include: { product: { include: { seller: true } } } } } },
        direction: true,
        shippingDetail: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId  = req.params.id;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { variant: { include: { product: { include: { seller: true } } } } } },
        direction: true,
        shippingDetail: true,
      },
    });
    if (!order || order.deleted) return res.status(404).json({ error: "Order not found" });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const updateShippingStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const { status, trackingNumber, trackingUrl }: { 
        status: ShippingStatus; 
        trackingNumber: string; 
        trackingUrl: string 
    } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { deleted: false }
    });
    if (!updatedOrder) throw new Error();

    const updatedShippingDetail = await prisma.shippingDetail.update({
      where: { orderId },
      data: {
        status,
        trackingNumber,
        trackingUrl
      },
    });
    if (!updatedShippingDetail) throw new Error();

    return res.status(200).json(updatedShippingDetail);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update shipping" });
  }
};

export const deleteHistoryOrderByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.deleted) return res.status(404).json({ error: "User not found" });

        const deletedOrders = await prisma.order.updateMany({ where: { userId }, data: { deleted: true }});
        if (!deletedOrders) throw new Error();
        
        return res.status(200).json(deletedOrders);
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete orders" });
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.deleted) return res.status(404).json({ error: "Order not found" });

    const deletedOrder = await prisma.order.update({ where: { id: orderId }, data: { deleted: true }});
    if (!deletedOrder) throw new Error();

    return res.status(200).json(deletedOrder);
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete order" });
  }
};

export const restoreOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || !order.deleted) return res.status(404).json({ error: "Order not found or not deleted" });

    const restoredOrder = await prisma.order.update({ where: { id: orderId }, data: { deleted: false }});
    if (!restoredOrder) throw new Error();
    
    return res.status(200).json(restoredOrder);
  } catch (error) {
    return res.status(500).json({ error: "Failed to restore order" });
  }
};

export const getSoldItems = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });

        const map: Record<
            string,
            {
                product: Omit<IProduct, "likedBy" | "discounts" | "variants">,
                variants: (Pick<IProductVariant, "id" | "color" | "size" | "stock"> & { quantity: number })[],
                totalQuantity: number
            }
        > = {};

        for (const order of orders) {
            const soldItems = order.items.filter(
                item => item.variant.product?.sellerId === userId
            );

            for (const item of soldItems) {
                const product = item.variant.product;
                if (!product || product.deleted) continue;

                const productId = product.id;
                const variant = item.variant;

                // Initialize product
                if (!map[productId]) {
                    map[productId] = {
                        product: { ...product },
                        variants: [],
                        totalQuantity: 0
                    };
                }

                let variantEntry = map[productId].variants.find(v => v.id === variant.id);

                if (!variantEntry) {
                    variantEntry = {
                        id: variant.id,
                        color: variant.color,
                        size: variant.size,
                        stock: variant.stock,
                        quantity: 0
                    };
                    map[productId].variants.push(variantEntry);
                }

                // Sum sold quantity
                variantEntry.quantity += item.quantity;
                map[productId].totalQuantity += item.quantity;
            }
        }

        return res.status(200).json(Object.values(map));

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to fetch sold items" });
    }
};
