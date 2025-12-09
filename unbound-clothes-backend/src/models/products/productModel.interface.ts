import { Category} from "@prisma/client";
import { IDiscount } from "../discounts/discountModel.interface";
import { IUser } from "../user/userModel.interface";
import { IProductVariant } from "./variants/variantsModel.interface";

export interface IProduct {
  id: string;
  deleted: boolean;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: Category;
  sellerId: string;
  discounts: IDiscount[];
  likedBy: IUser[];
  variants: IProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export type ICreateUpdateProduct = Omit<IProduct, 'id' | 'deleted' | 'discounts' | 'likedBy' | 'variants' | 'createdAt' | 'updatedAt'>;