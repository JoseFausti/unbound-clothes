import type { IOrder, ShippingStatus } from "../../../../../types/schemas.db"
import { deleteOrderBanner, errorBanner, getDirection, getProductAndVariant, successBanner } from "../../../../../utils/functions"
import Styles from "./OrderProductCard.module.css"
import axiosInstance from "../../../../../config/axios"
import useAuth from "../../../../../hooks/useAuth"
import { useAppDispatch } from "../../../../../hooks/redux"
import { updateUser } from "../../../../../store/slices/userSlice"
import { Close } from "@mui/icons-material"
import { useState } from "react"

interface OrderProductCardProps {
  order: IOrder
}

const OrderProductCard: React.FC<OrderProductCardProps> = ({ order }) => {

    const {user} = useAuth();
    const dispatch = useAppDispatch();

    const direction = getDirection(order.directionId)

    const [openStatus, setOpenStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order.shippingDetail?.status);

    const shippingOptions: { value: ShippingStatus, label: string }[] = [
        { value: "PENDING", label: "Pending" },
        { value: "IN_TRANSIT", label: "In Transit" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "RETURNED", label: "Returned" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

    const deleteOrder = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            await deleteOrderBanner()
                .then(async (res) => {
                    if (res) await axiosInstance.delete(`/orders/${order.id}`)
                        .then((res) => {
                            if (res.data) {
                                successBanner();
                                dispatch(updateUser({...user, orders: user.orders.filter(o => o.id !== order.id)}));
                            }
                        })
                });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            errorBanner();
        }
    }

    const handleStatusChange = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            await axiosInstance.put(`/orders/${order.id}`, { status: selectedStatus })
            .then((res) => {
                if (res.data) {
                    successBanner();
                }
            });
            setOpenStatus(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            errorBanner();
        }
    }

  return (
    <div className={Styles.card}>
      <div className={Styles.header}>
        <h3 className={Styles.title}><strong>Order: </strong>#{order.id}</h3>
        { user?.role === "USER" &&
            <Close className={Styles.closeButton} onClick={deleteOrder} />
        }
      </div>

      <div className={Styles.itemsList}>
        {order.items.map((item) => {
            const matchProduct = getProductAndVariant(item.variantId)
            if (!matchProduct) return null
            const { product, variant } = matchProduct

            return (
                <div key={item.id} className={Styles.item}>
                    <div className={Styles.imageContainer}>
                        <img src={product.imageUrl} alt={product.name} className={Styles.image} />
                    </div>
                    <div className={Styles.itemInfo}>
                        <h4 className={Styles.itemName}>{product.name}</h4>
                        <p><strong>Color:</strong> {variant.color}</p>
                        <p><strong>Size:</strong> {variant.size}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Unit Price:</strong> ${item.unitPrice}</p>
                    </div>
                </div>
            )
            })}

      </div>

      <div className={Styles.details}>
        {order.shippingDetail
            ? (
            <>
                <p><strong>Direction:</strong> {order.shippingDetail.addressSnapshot.split("-")[1]}</p>
                <p><strong>Shipping Cost:</strong> ${order.shippingDetail.shippingCost.toFixed(2)}</p>
                <p><strong>Carrier:</strong> {order.shippingDetail.carrier.replace("_", " ")}</p>
                {order.shippingDetail.trackingNumber &&
                    <p>
                        <strong>Tracking:</strong>{" "}
                        <a
                            href={order.shippingDetail.trackingUrl ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={Styles.trackingLink}
                        >
                            {order.shippingDetail.trackingNumber}
                        </a>
                    </p>
                }
                <p className={Styles.status}>
                    <div className={Styles.shipmentStatus}>
                        <strong>Shipment Status: </strong> 
                        <span
                            className={`${Styles.badge} ${
                                selectedStatus === "PENDING"
                                    ? Styles.pending
                                    : selectedStatus === "IN_TRANSIT"
                                    ? Styles.inTransit
                                    : selectedStatus === "DELIVERED"
                                    ? Styles.delivered
                                    : selectedStatus === "RETURNED"
                                    ? Styles.returned
                                    : Styles.rejected
                                }`
                            }
                        >
                            {selectedStatus}
                        </span>
                    </div>
                    {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                        <div className={Styles.selectWrapper}>
                            <div
                                className={Styles.customSelect}
                                onClick={() => setOpenStatus(prev => !prev)}
                            >
                            <span>
                                {shippingOptions.find(o => o.value === selectedStatus)?.label ||
                                order.shippingDetail.status}
                            </span>
                            <span
                                className={`${Styles.customArrow} ${
                                openStatus ? Styles.open : ""
                                }`}
                            >
                                ▾
                            </span>
                            </div>

                            {openStatus && (
                                <ul className={Styles.optionsList}>
                                    {shippingOptions.map(opt => (
                                    <li
                                        key={opt.value}
                                        className={Styles.optionItem}
                                        onClick={() => {
                                        setSelectedStatus(opt.value);
                                        setOpenStatus(false);
                                        }}
                                    >
                                        {opt.label}
                                    </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        )}

                </p>
            </>
            ) : direction  
                ? (
                <>
                    <p className={Styles.address}><strong>Shipment Address:</strong> {direction.address}</p>
                </>
                ) 
                : null
        }
        <div className={Styles.paymentInfo}>
            <p className={Styles.paymentMethod}><strong>Payment Method:</strong> {order.paymentMethod.replace("_", " ")}</p>
            <p className={Styles.status}>
                <strong>Payment Status:{" "}</strong>
                <span
                    className={`${Styles.badge} ${
                    order.paymentStatus === "APPROVED"
                        ? Styles.approved
                        : order.paymentStatus === "PENDING"
                        ? Styles.pending
                        : Styles.rejected
                    }`}
                >
                    {order.paymentStatus}
                </span>
            </p>
        </div>
      </div>

      <div className={Styles.footer}>
        <h3 className={Styles.total}>
          Total: ${order.totalAmount.toFixed(2)}
        </h3>
        {user?.role !== "USER" && 
            <div className={Styles.saveButtonContainer}>
                <button 
                    className={Styles.saveButton}
                    onClick={handleStatusChange}
                >
                    Save
                </button>
            </div>
        }
      </div>
    </div>
  )
}

export default OrderProductCard
