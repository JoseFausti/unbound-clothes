import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ICartWithProducts, IOrder, IProduct, IProductVariant } from "../../types/schemas.db";
import axiosInstance from "../../config/axios";
import type { RootState } from "../store";

export type CartProductPayload = {
  variant: IProductVariant & {product: IProduct};
  quantity: number;
};

interface CartState {
  cartId?: string;
  cart: CartProductPayload[];
  loading?: boolean;
  error?: string;
  orders: IOrder[]
}

export const getExistingCart = createAsyncThunk(
  "cart/getExistingCart",
  async (userId: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get<ICartWithProducts>(`/cart/user/${userId}`);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || "Failed to fetch cart");
    }
  }
);

export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async (cartId: string, {getState, rejectWithValue}) => {
    const {cart: {cart}} = getState() as RootState;
    const cartItems = cart.map(item => ({
      variantId: item.variant.id,
      quantity: item.quantity
    }));
    try {
      const response = await axiosInstance.put<ICartWithProducts>(`/cart/${cartId}`, {cartItems});
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch cart");
    }
  }
);

export const getAllOrders = createAsyncThunk(
  "cart/getAllOrders",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get<IOrder[]>("/orders");
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || "Failed to fetch orders");
    }
  }
)

const storedCart = sessionStorage.getItem("cart");
const initialCart: { cartId?: string; cart: CartProductPayload[] } = storedCart
  ? JSON.parse(storedCart)
  : { cartId: undefined, cart: [] };
  
const initialState: CartState = { cartId:  initialCart.cartId, cart: initialCart.cart, orders: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartProductPayload[]>) => {
      state.cart = action.payload;
      sessionStorage.setItem("cart", JSON.stringify({cartId: state.cartId, cart: state.cart}));
    },
    addToCart: (state, action: PayloadAction<CartProductPayload>) => {
      const existingItem = state.cart.find(item => item.variant.id === action.payload.variant.id);
      if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + action.payload.quantity, existingItem.variant.stock);
      } else {
        state.cart.push(action.payload);
      }
      sessionStorage.setItem("cart",JSON.stringify({ cartId: state.cartId, cart: state.cart }));
    },

    incrementQuantity: (state, action: PayloadAction<CartProductPayload>) => {
      state.cart = state.cart.map(item => {
        if (item.variant.id === action.payload.variant.id) {
          if (item.quantity < item.variant.stock) {
            return { ...item, quantity: item.quantity + 1 };
          }
        }
        return item;
      });
      sessionStorage.setItem("cart", JSON.stringify({ cartId: state.cartId, cart: state.cart }));
    },
    decrementQuantity: (state, action: PayloadAction<CartProductPayload>) => {
      state.cart = state.cart.map(item => {
        if (item.variant.id === action.payload.variant.id) {
          return { ...item, quantity: Math.max(0, item.quantity - 1) };
        }
        return item;
      }).filter(item => item.quantity > 0);

      sessionStorage.setItem("cart", JSON.stringify({ cartId: state.cartId, cart: state.cart }));
    },
    removeFromCart: (state, action: PayloadAction<CartProductPayload>) => {
      if (!state.cart.some(item => item.variant.id === action.payload.variant.id)) return;
      state.cart = state.cart.filter(item => item.variant.id !== action.payload.variant.id);
      sessionStorage.setItem("cart", JSON.stringify({cartId: state.cartId, cart: state.cart}));
    },
    clearCart: (state) => { 
      state.cartId = undefined;
      state.cart = [];
      state.error = undefined;
      sessionStorage.removeItem("cart");
    },
    clearError: (state) => { state.error = undefined }
  },
  extraReducers: (builder) => {
    // Get existing cart
    builder.addCase(getExistingCart.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getExistingCart.fulfilled, (state, action) => {
      state.cartId = action.payload.id;
      state.cart = action.payload.cartItems.map(item => ({ variant: item.variant, quantity: item.quantity }));
      sessionStorage.setItem("cart", JSON.stringify({cartId: state.cartId, cart: state.cart}));
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(getExistingCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // Sync cart
    builder.addCase(syncCart.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(syncCart.fulfilled, (state, action) => {
      state.cartId = action.payload.id;
      state.cart = action.payload.cartItems.map(item => ({ variant: item.variant, quantity: item.quantity }));
      sessionStorage.setItem("cart", JSON.stringify({cartId: state.cartId, cart: state.cart}));
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(syncCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // Get orders
    builder.addCase(getAllOrders.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(getAllOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
})

export const { 
  setCart, 
  addToCart, 
  incrementQuantity, 
  decrementQuantity, 
  removeFromCart, 
  clearCart, 
  clearError
} = cartSlice.actions;
export default cartSlice.reducer;