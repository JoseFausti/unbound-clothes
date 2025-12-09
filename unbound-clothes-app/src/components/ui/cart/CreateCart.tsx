import { useEffect, useState } from "react";
import axiosInstance from "../../../config/axios";
import type { ICart } from "../../../types/schemas.db";
import { errorBanner } from "../../../utils/functions";
import Styles from "./CreateCart.module.css"
import useAuth from "../../../hooks/useAuth";
import { Loader } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/redux";
import { clearError } from "../../../store/slices/cartSlice";

const CreateCart: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { user, loading } = useAuth();
    const [error, setError] = useState("");
    
    const createCart = async () => {
        try {
            const res = await axiosInstance.post<ICart>("/cart", {userId: user!.id})
            if (res.data) {
                dispatch(clearError());
                navigate("/cart");
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            await errorBanner();
            setError(error.response?.data?.error)
        }
    }
    
    useEffect(() => {
        if (error) setTimeout(()=> setError(""), 1500);
    }, [error])
    
    if (loading) return <Loader />
    if (!loading && !user) return <Navigate to="/login" replace />
    
    return(
        <div className={Styles.container}>
            <h2 className={Styles.title}>Your cart is empty </h2>
            <p className={Styles.description}>
                Once you add items to your cart, they will appear here. 
                <br/>
                Let start shopping!
            </p>
            <button className={Styles.button} onClick={createCart}>Start shopping</button>
            {error && <p className={Styles.error}>{error}</p>}
        </div>
    )
}

export default CreateCart
