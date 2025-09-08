import { Category } from "@prisma/client";
import { ICartItem } from "../cart/cartItem/cartItemModel.interface";
import { IDiscount } from "../discounts/discountModel.interface";

export interface IProduct {
  id: string;
  deleted: boolean;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: Category;
  color: string;
  size: number;
  stock: number;
  sellerId: string;
  discounts: IDiscount[];
  cartItems: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type ICreateUpdateProduct = Omit<IProduct, 'id' | 'deleted' | 'discounts' | 'cartItems' | 'createdAt' | 'updatedAt'>;