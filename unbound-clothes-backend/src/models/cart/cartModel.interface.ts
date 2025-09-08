import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { ICartItem } from "./cartItem/cartItemModel.interface";

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

export type ICreateCart = Pick<ICart, "userId">;
