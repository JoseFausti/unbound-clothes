import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux"
import AdminDashboard from "../../../ui/admin/dashboard/AdminDashboard"
import { getAllUsers } from "../../../../store/slices/userSlice";
import Error from "../../../ui/error/Error";
import Loader from "../../../ui/loader/Loader";
import { getAllOrders } from "../../../../store/slices/cartSlice";

const Dashboard = () => {

  const {users, loading} = useAppSelector(state => state.user);
  const {orders} = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (users.length === 0) dispatch(getAllUsers());
    if (orders.length === 0) dispatch(getAllOrders());
  }, [users.length, orders.length, dispatch]);

  if (loading) return <Loader />
  if (!loading && !users.length ) return <Error />

  return (
    <AdminDashboard users={users} orders={orders} />
  )
}

export default Dashboard
