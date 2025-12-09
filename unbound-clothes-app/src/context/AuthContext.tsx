import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { clearUser, getUser } from "../store/slices/userSlice";
import { getUserFromToken } from "../utils/functions";
import type { ITokenPayload, IUser } from "../types/schemas.db";
import { clearCart } from "../store/slices/cartSlice";

interface AuthContextProps {
    user: Omit<IUser, "password"> | null;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.user);
    const [loading, setLoading] = useState(true);

    const login = (token: string) => {
        Cookies.set("auth-token", token);
        const decodedUser = getUserFromToken(token);
        if (decodedUser) dispatch(getUser(decodedUser.id));
        navigate("/", { replace: true });
    };

    const logout = useCallback(() => {
        Cookies.remove("auth-token");
        sessionStorage.removeItem("products");
        dispatch(clearUser());
        dispatch(clearCart());
        navigate("/", { replace: true });
    }, [dispatch, navigate]);

    const isExpired = (decodedUser: ITokenPayload) => {
        const now = Math.floor(Date.now() / 1000);
        return decodedUser.exp < now;
    };

    useEffect(() => {
        const authToken = Cookies.get("auth-token");
        if (!authToken) {
            setLoading(false);
            return;
        }

        const decodedUser = getUserFromToken(authToken);
        if (decodedUser && !isExpired(decodedUser)) {
            dispatch(getUser(decodedUser.id))
                .finally(() => setLoading(false));
        } else {
            logout();
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
