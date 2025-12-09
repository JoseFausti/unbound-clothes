import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";
import type { IProduct } from "../../types/schemas.db";

export const getAllProducts = createAsyncThunk(
    "products/getAllProducts",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get<IProduct[]>("/products");
            return response.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to fetch products");
        }
    }
)

interface ProductsState {
    products: IProduct[];
    productActive?: IProduct;
    loading?: boolean; 
    error?: string
}

const initialProducts: IProduct[] = JSON.parse(sessionStorage.getItem("products") || "[]");
const initialState: ProductsState = { products: initialProducts };

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setActiveProduct: (state, action: PayloadAction<IProduct | undefined>) => {state.productActive = action.payload},
        updateProducts: (state, action: PayloadAction<IProduct>) => {
            state.products = state.products.map(product => product.id === action.payload.id ? action.payload : product);
            sessionStorage.setItem("products", JSON.stringify(state.products));
        },
        addProduct: (state, action: PayloadAction<IProduct>) => {
            state.products.push(action.payload);
            sessionStorage.setItem("products", JSON.stringify(state.products));
        },
        removeProduct: (state, action: PayloadAction<IProduct>) => {
            state.products = state.products.filter(product => product.id !== action.payload.id);
            sessionStorage.setItem("products", JSON.stringify(state.products));
        },
        clearError: (state) => {state.error = undefined}
    },
    extraReducers: (builder) => {
        builder.addCase(getAllProducts.pending, (state) => {
            state.loading = true;
            state.error = undefined;
        });
        builder.addCase(getAllProducts.fulfilled, (state, action) => {
            state.products = action.payload;
            sessionStorage.setItem("products", JSON.stringify(state.products));
            state.loading = false;
            state.error = undefined;
        });
        builder.addCase(getAllProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const { setActiveProduct, addProduct, removeProduct, updateProducts, clearError } = productsSlice.actions;
export default productsSlice.reducer;