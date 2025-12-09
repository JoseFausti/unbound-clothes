import axiosInstance from "../../../../../config/axios";
import { useAppDispatch } from "../../../../../hooks/redux";
import useAuth from "../../../../../hooks/useAuth";
import { updateUser } from "../../../../../store/slices/userSlice";
import { deleteHistoryBanner, errorBanner, successBanner } from "../../../../../utils/functions";
import Styles from "./MyOrders.module.css";
import OrderProductCard from "./OrderProductCard";

const MyOrders = () => {
    const {user} = useAuth();
    const dispatch = useAppDispatch();

    const handleDeleteHistory = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            await deleteHistoryBanner()
                .then(async (res) => {
                    if (res) await axiosInstance.delete(`/orders/user/${user.id}`)
                        .then((res) => {
                            if (res.data) {
                                successBanner();
                                dispatch(updateUser({...user, orders: []}));
                            }
                        })
                });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            errorBanner();
        }
    }

  return (
    <div className={Styles.orderProductsWrapper}>
        { user?.orders.filter((order) => !order.deleted).length
        ? (
        <div className={Styles.orderProductsContainer}>
            {user.orders
                .filter((order) => !order.deleted)
                .map((order) => (
                    <OrderProductCard key={order.id} order={order} />
                ))
            }
            <div className={Styles.deleteHistory}>
                <button 
                    className={Styles.deleteHistoryButton}
                    onClick={handleDeleteHistory}
                >
                    Delete History
                </button>
            </div>
        </div>
        ) : (
        <div className={Styles.emptyState}>
            <h2 className={Styles.favoriteProductsTitle}>My Orders</h2>
            <p className={Styles.favoriteProductsDescription}>
                Your list of orders will appear here.
            </p>
        </div>
        )}
    </div>
  )
}

export default MyOrders
