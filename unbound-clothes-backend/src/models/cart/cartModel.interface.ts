import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { ICartItem } from "./cartItem/cartItemModel.interface";
import { IProductVariant } from "../products/variants/variantsModel.interface";
import { IProduct } from "../products/productModel.interface";

export interface ICart {
  id: string;
  deleted: boolean;    
  userId: string;
  cartItems: ICartItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}
export interface ICartWithProducts extends Omit<ICart, "cartItems"> {
  cartItems: (ICartItem & { variant: IProductVariant & { product: IProduct} })[];
}

export type ICreateCart = Pick<ICart, "userId">;
