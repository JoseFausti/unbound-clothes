import { PaymentStatus } from "@prisma/client";
import { PaymentMethod } from "mercadopago";
import { IOrderItem } from "./orderItems/orderItemModel.interface";

export interface IOrder{
    id: string;
    deleted: boolean;
    userId: string;
    directionId: string;
    items: IOrderItem[];
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}