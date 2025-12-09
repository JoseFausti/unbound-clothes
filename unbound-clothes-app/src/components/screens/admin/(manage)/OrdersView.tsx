import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import AdminOrdersView from "../../../ui/admin/orders/AdminOrdersView";
import { getAllOrders } from "../../../../store/slices/cartSlice";
import Loader from "../../../ui/loader/Loader";

const OrdersView = () => {

    const {orders, loading} = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    if (loading) return <Loader />
    return (
        <AdminOrdersView orders={orders}/>
    )
}

export default OrdersView
