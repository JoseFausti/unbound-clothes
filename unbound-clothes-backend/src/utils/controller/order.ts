import { Carrier, PaymentStatus, ShippingStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { calculateDiscountedPrice } from "../functions";
import { sendEmail } from "../mailer";
import { IProduct } from "../../models/products/productModel.interface";

interface ICreateOrderFromCartParams {
  cartId: string;
  directionId: string;
  shippingCost: number;
}

export const createOrderFromCartInternal = async ({ cartId, directionId, shippingCost }: ICreateOrderFromCartParams) => {
  try {
    const direction = await prisma.direction.findUnique({ where: { id: directionId } });
    if (!direction || direction.deleted) throw new Error("Direction not found");

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        user: true,
        cartItems: { include: { variant: { include: { product: { include: { discounts: true } } } } } },
      },
    });
    if (!cart || cart.deleted) throw new Error("Cart not found");
    if (cart.cartItems.length === 0) throw new Error("Cart is empty");

    const totalAmount = cart.cartItems.reduce((acc, item) => {
      if (!item.variant || item.variant.stock < item.quantity) throw new Error("Insufficient stock");
      const product = item.variant.product;
      const discountedPrice = calculateDiscountedPrice(product as IProduct);
      return acc + discountedPrice * item.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: cart.userId,
          directionId,
          paymentMethod: cart.paymentMethod,
          paymentStatus: PaymentStatus.APPROVED,
          totalAmount,
          items: {
            create: cart.cartItems.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: calculateDiscountedPrice(item.variant!.product as IProduct),
            })),
          },
          shippingDetail: {
            create: {
              carrier: Carrier.CORREO_ARGENTINO,
              status: ShippingStatus.PENDING,
              shippingCost,
              addressSnapshot: `${cart.user.name} - ${direction.address} - ${new Date().toISOString()}`,
            },
          },
        },
        include: { 
          items: { include: { variant: { include: { product: true } } } }, 
          shippingDetail: true, 
          direction: true 
        }
      });

      for (const item of cart.cartItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: Math.max(0, item.variant!.stock - item.quantity) },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId } });

      return newOrder;
    });

    if (!order) throw new Error("Failed to create order");

    await sendEmail(cart.user.email, "Tu compra fue confirmada 🎉", `Gracias por tu compra. Total: $${totalAmount.toFixed(2)}`);

    return order;
  } catch (error) { console.error(error) }
};