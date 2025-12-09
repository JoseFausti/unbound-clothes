export interface IDiscount {
  id: string;
  productId: string;
  percentage: number;
  startDate: Date;
  endDate: Date;
}

export type ICreateUpdateDiscount = Omit<IDiscount, 'id' | 'productId'>;