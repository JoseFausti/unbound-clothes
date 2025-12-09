import { Color } from "@prisma/client";
import { ICartItem } from "../../cart/cartItem/cartItemModel.interface";
import { IOrderItem } from "../../orders/orderItems/orderItemModel.interface";

export interface IProductVariant {
  id?: string;
  productId: string;
  color: Color;
  size: string;
  weight?: number | null;
  stock: number;
  cartItem?: ICartItem;
  orderItems: IOrderItem[];
}

export type ICreateUpdateProductVariant = Omit<IProductVariant, | "productId" | "cartItem" | "orderItems">;