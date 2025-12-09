export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'SELLER' | 'USER';

export type PaymentMethod = 'MERCADO_PAGO';

export type PaymentStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export type Carrier = 'CORREO_ARGENTINO';

export type ShippingStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED' | 'CANCELLED';

export type Category =
  |'SHIRTS'
  | 'TSHIRTS'
  | 'SWEATSHIRTS'
  | 'JACKETS'
  | 'PANTS'
  | 'SHORTS'
  | 'SNEAKERS'
  | 'BOOTS'
  | 'SANDALS'
  | 'ACCESSORIES'
  | 'UNDERWEAR'

export const categories: Category[] = [
  'SHIRTS',
  'TSHIRTS',
  'SWEATSHIRTS',
  'JACKETS',
  'PANTS',
  'SHORTS',
  'SNEAKERS',
  'BOOTS',
  'SANDALS',
  'ACCESSORIES',
  'UNDERWEAR',
];

export const clothingCategories: Category[] = ["SHIRTS", "TSHIRTS", "SWEATSHIRTS", "JACKETS", "PANTS", "SHORTS", "UNDERWEAR"];
export const shoeCategories: Category[] = ["SNEAKERS", "BOOTS", "SANDALS"];

export type ClothingSize =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | 'XXXL';

export const clothingSizes: ClothingSize[] = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
];

export type ShoeSize =
 | 'EU_36'
 | 'EU_37'
 | 'EU_38'
 | 'EU_39'
 | 'EU_40'
 | 'EU_41'
 | 'EU_42'
 | 'EU_43'
 | 'EU_44'
 | 'EU_45';

export const shoeSizes: ShoeSize[] = [
  'EU_36',
  'EU_37',
  'EU_38',
  'EU_39',
  'EU_40',
  'EU_41',
  'EU_42',
  'EU_43',
  'EU_44',
  'EU_45',
];

export type Color =
  | 'BLACK'
  | 'WHITE'
  | 'GRAY'
  | 'CHARCOAL'
  | 'RED'
  | 'BURGUNDY'
  | 'BLUE'
  | 'NAVY'
  | 'TEAL'
  | 'CYAN'
  | 'MAGENTA'
  | 'GREEN'
  | 'OLIVE'
  | 'LIME'
  | 'YELLOW'
  | 'ORANGE'
  | 'PINK'
  | 'PURPLE'
  | 'VIOLET'
  | 'BROWN'
  | 'BEIGE'
  | 'CREAM'
  | 'SILVER'
  | 'GOLD'
  | 'BRONZE';

export const colors: Color[] = [
  'BLACK',
  'WHITE',
  'GRAY',
  'CHARCOAL',
  'RED',
  'BURGUNDY',
  'BLUE',
  'NAVY',
  'TEAL',
  'CYAN',
  'MAGENTA',
  'GREEN',
  'OLIVE',
  'LIME',
  'YELLOW',
  'ORANGE',
  'PINK',
  'PURPLE',
  'VIOLET',
  'BROWN',
  'BEIGE',
  'CREAM',
  'SILVER',
  'GOLD',
  'BRONZE',
];

interface IBase {
  id: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser extends IBase {
  name:      string;
  email:     string;
  imageUrl:  string;
  password:  string;
  role:   UserRole;
  cart?: ICart;
  sellerProducts: IProduct[];
  favorites: IProduct[];
  directions: IDirection[];
  orders: IOrder[]; 
}

export interface IProductVariant {
  id?: string;
  productId: string;
  color: Color;
  size: string;
  stock: number;
  cartItem?: ICartItem;
  orderItems: IOrderItem[]
}

export type ICreateUpdateProductVariant = Omit<IProductVariant, | "productId" | "cartItem" | "orderItems">;

export interface IProduct extends IBase {
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  category: Category;
  sellerId: string;
  discounts: IDiscount[];
  likedBy: IUser[];
  variants: IProductVariant[];
}

export type ICreateUpdateProduct = Omit<IProduct, 'id' | 'deleted' | 'discounts' | 'likedBy' | 'variants'>;

export interface IDiscount {
  id: string;
  productId: string;
  percentage: number;
  startDate: Date;
  endDate: Date;
}

export type ICreateUpdateDiscount = Omit<IDiscount, 'id'>;

export interface IDirection extends IBase {
  userId: string;
  address: string;
  orders: IOrder[];
}

export interface ICart extends IBase {
  userId: string;
  cartItems: ICartItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}

export interface ICartWithProducts extends Omit<ICart, "cartItems"> {
  cartItems: (ICartItem & { variant: IProductVariant & { product: IProduct} })[];
}

export type ICreateCart = Pick<ICart, "userId">;

export interface ICartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
}

export type ICreateCartItem = Omit<ICartItem, 'id'>;
export type IUpdateCartItem = Omit<ICartItem, 'id' | 'cartId'>;

export interface ITokenPayload {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  role: UserRole;
  favorites?: IProduct[];
  orders?: IOrder[];
  iat: number;
  exp: number;
}

export interface ICloudinaryUpload {
  url: string;
  size: number;
  duration?: number; // only video
  width: number;
  height: number;
  format: string;
  originalName: string;
  publicId: string;
};

export interface IOrder extends IBase {
  userId: string;
  directionId: string;
  items: IOrderItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  shippingDetail: IShippingDetail;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
}

export interface IShippingDetail {
  id: string;
  orderId: string;
  carrier: Carrier;
  trackingNumber?: string;
  trackingUrl?: string;
  status: ShippingStatus;
  shippingCost: number;
  addressSnapshot: string;
  estimatedDate?: Date;
  deliveredDate?: Date;
}