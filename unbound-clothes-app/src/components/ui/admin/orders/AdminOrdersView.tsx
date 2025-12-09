import { Link } from "react-router-dom";
import type { IOrder } from "../../../../types/schemas.db";
import OrderProductCard from "../../user/profile/orders/OrderProductCard";
import Styles from "./AdminOrdersView.module.css";

interface AdminOrdersViewProps {
    orders: IOrder[];
}
const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({orders}) => {
  return (
    <div className={Styles.orderProductsWrapper}>
        <div className={Styles.headerContainer}>
            <div className={Styles.backLinkContainer}>
                <Link to="/admin" className={Styles.backLink}> Go Back </Link>
            </div>
        </div>
        <div className={Styles.orderProductsContainer}>
            {orders
                .map((order) => (
                    <OrderProductCard key={order.id} order={order} />
                ))
            }
        </div>
    </div>
  )
}

export default AdminOrdersView
