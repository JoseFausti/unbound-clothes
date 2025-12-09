import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";
import type { IProduct, ITokenPayload, IUser } from "../../types/schemas.db";
import type { RootState } from "../store";

export const getAllUsers = createAsyncThunk(
    "users/getAllUsers",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get<Omit<IUser, "password">[]>("/users");
            return response.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to fetch users");
        }
    }
)

export const getUser = createAsyncThunk(
    "users/getUser",
    async (userId: string, thunkAPI) => {
        try {
            const response = await axiosInstance.get<Omit<IUser, "password">>(`/users/${userId}`);
            return response.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to fetch user");
        }
    }
)

export const syncFavorites = createAsyncThunk(
    "users/syncFavorites",
    async (userId: string, {getState, rejectWithValue}) => {
        const { user: { user } } = getState() as RootState;
        if (!user) return rejectWithValue("User not found");
        try {
            const response = await axiosInstance.put<Omit<IUser, "password">>(
                `/users/${userId}/favorites`,
                { favorites: user.favorites }
            );
            return response.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue("Failed to sync favorites");
        }
    }
)

interface UsersState {
    users: Omit<IUser, "password">[];
    user: Omit<IUser, "password"> | null;
    loading?: boolean; 
    error?: string
}

const initialState: UsersState = { users: [], user: null, loading: true };

const saveUserToSession = (user: Omit<IUser, "password">) => {
    const sessionUser: Omit<ITokenPayload, "iat" | "exp"> = {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        favorites: user.favorites,
        orders: user.orders,
        role: user.role
    }
    sessionStorage.setItem("user", JSON.stringify(sessionUser));
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<Omit<IUser, "password">>) => {
            state.users.push(action.payload);
        },
        updateUsers: (state, action: PayloadAction<Omit<IUser, "password">>) => {
            state.users = state.users.map(u => u.id === action.payload.id ? action.payload : u);
        },
        removeUser: (state, action: PayloadAction<Omit<IUser, "password">>) => {
            state.users = state.users.filter(u => u.id !== action.payload.id);
        },
        updateUser: (state, action: PayloadAction<Omit<IUser, "password">>) => {
            if (state.user && state.user.id === action.payload.id) {
                state.user = action.payload;
                saveUserToSession(state.user);
            }
        },
        toggleFavorite: (state, action: PayloadAction<IProduct>) => {
            if (!state.user) return;

            if (state.user.favorites.some(prod => prod.id === action.payload.id)) {
                state.user.favorites = state.user.favorites.filter(prod => prod.id !== action.payload.id);
            } else {
                state.user.favorites.push(action.payload);
            }
            saveUserToSession(state.user);  
        },
        clearError: (state) => {state.error = undefined},
        clearUser: (state) => {
            state.user = null;
            state.error = undefined;
            sessionStorage.removeItem("user");
        }
    },
    extraReducers: (builder) => {
        // Get all users
        builder.addCase(getAllUsers.pending, (state) => {
            state.loading = true;
            state.error = undefined;
        });
        builder.addCase(getAllUsers.fulfilled, (state, action) => {
            state.users = action.payload;
            state.loading = false;
            state.error = undefined;
        });
        builder.addCase(getAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        // Get user
        builder.addCase(getUser.pending, (state) => {
            state.loading = true;
            state.error = undefined;
        });
        builder.addCase(getUser.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = action.payload;
                saveUserToSession(state.user);
            }
            state.loading = false;
            state.error = undefined;
        });
        builder.addCase(getUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        // Sync favorites
        builder.addCase(syncFavorites.pending, (state) => {
            state.loading = true;
            state.error = undefined;
        });
        builder.addCase(syncFavorites.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = action.payload;
                saveUserToSession(state.user);
            }
            state.loading = false;
            state.error = undefined;
        });
        builder.addCase(syncFavorites.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const { addUser, removeUser, updateUsers, updateUser, toggleFavorite, clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;