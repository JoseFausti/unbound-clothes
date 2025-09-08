import { IProduct } from "../products/productModel.interface";

export interface IDiscount {
  id: string;
  products: IProduct[];
  percentage: number;
  startDate: Date;
  endDate: Date;
}
