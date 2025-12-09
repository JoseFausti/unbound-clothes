import { IOrder } from "../orders/orderModel.interface";

export interface IDirection {
    id: string;
    deleted: boolean;
    userId: string;
    address: string;
    orders: IOrder[];
    createdAt: Date;
    updatedAt: Date;
}