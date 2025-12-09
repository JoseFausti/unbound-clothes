import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { getExistingCart, syncCart } from "../../../store/slices/cartSlice";
import Loader from "../../ui/loader/Loader";
import Error from "../../ui/error/Error";
import CartSummary from "../../ui/cart/CartSummary";
import { getUser } from "../../../store/slices/userSlice";
import { errorPurchaseBanner, pendingPurchaseBanner, succesPurchaseBanner } from "../../../utils/functions";

const Cart = () => {

  const { user, loading: userLoading } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();
  const result = new URLSearchParams(location.search).get("result");

  const dispatch = useAppDispatch();
  const { cartId, loading: cartLoading, error } = useAppSelector(state => state.cart);

  useEffect(() => {
    if (!cartId && user) dispatch(getExistingCart(user.id));
  }, [dispatch, cartId, user]);

  useEffect(()=>{
    return () => {
      if (cartId) dispatch(syncCart(cartId));
    }
  }, [dispatch, cartId]);

  useEffect(() => {
    if (!result) return;

    switch (result) {
      case "success":
        succesPurchaseBanner();
        navigate("/cart", { replace: true });
        break;
      case "failure":
        errorPurchaseBanner();
        navigate("/cart", { replace: true });
        break;
      case "pending":
        pendingPurchaseBanner();
        navigate("/cart", { replace: true });
        break;
    }
  }, [result, navigate]);

  useEffect(() => {
    if (result && user) dispatch(getUser(user!.id));
  }, [result, dispatch, user]);
  
  if (userLoading || cartLoading) return <Loader /> 
  if (!userLoading && !user) return <Navigate to="/login" replace />

  return (
    <>
      {
        error 
          ? error === "Cart not found" 
            ? <Navigate to="/cart/create" replace/>
            : <Error error= { error } />
          : <CartSummary />
      }
    </>
  )
}

export default Cart
