import { UserRole } from "@prisma/client";
import { ICart } from "../cart/cartModel.interface";
import { IProduct } from "../products/productModel.interface";
import { IDirection } from "../directions/directionsModel.interface";

export interface IUser {
    id:        string;
    deleted:   boolean;
    name:      string;
    email:     string;
    imageUrl:  string;
    password:  string;
    role:   UserRole;
    cart?: ICart;
    sellerProducts: IProduct[];
    directions: IDirection[];
    createdAt: Date;
    updatedAt: Date;
}
