export interface ICartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
}

export type ICreateCartItem = Omit<ICartItem, 'id'>;
export type IUpdateCartItem = Omit<ICartItem, 'id' | 'cartId'>;

export interface IPreference {
  id: string;
  title: string;
  unit_price: number;
  picture_url: string;
  description: string;
  quantity: number;
}