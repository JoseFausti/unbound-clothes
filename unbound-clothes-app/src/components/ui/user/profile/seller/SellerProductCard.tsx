import { Navigate } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";
import type { IProduct } from "../../../../../types/schemas.db";
import Loader from "../../../loader/Loader";
import Styles from "./SellerProductCard.module.css"
import { calculateFinalProductPrice, deleteProductBanner, errorBanner, successBanner } from "../../../../../utils/functions";
import { useAppDispatch } from "../../../../../hooks/redux";
import { removeProduct, setActiveProduct } from "../../../../../store/slices/productsSlice";
import axiosInstance from "../../../../../config/axios";

interface SellerProductCardProps {
    product: IProduct
    soldQuantity: number;
    handleUpdate: () => void;
    handleAddStock?: () => void;
    handleUpdateDiscounts: () => void;
    handleSeeMore: () => void
}

const SellerProductCard: React.FC<SellerProductCardProps> = ({product, soldQuantity, handleUpdate, handleAddStock, handleUpdateDiscounts, handleSeeMore}) => {

    const { user, loading } = useAuth();
    const dispatch = useAppDispatch();

    const { original, final, hasDiscount } = calculateFinalProductPrice(product);

    if (loading) return <Loader />;
    if (!loading && !user) return <Navigate to="/" replace />;

    const handleDelete = async () => {
        try {
            const result = await deleteProductBanner();
            if (result) {
                await axiosInstance.delete(`/products/${product.id}`);
                dispatch(setActiveProduct(undefined));
                dispatch(removeProduct(product));
                successBanner();
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            errorBanner();
        }
    };

    return (
        <>
            <div className={Styles.cardWrapper}>
                <div className={Styles.card}>
                    <div className={Styles.imageContainer}>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className={Styles.image}
                        />
                    </div>
                    <div className={Styles.content}>
                        <h3 className={Styles.title}>{product.name}</h3>
                        <div className={Styles.priceContainer}>
                            <p className={Styles.price}>{final}</p>
                            {hasDiscount && <p className={Styles.oldPrice}>{original}</p>}
                        </div>
                        <p className={Styles.description}>{product.description}</p>
                        <div className={Styles.soldContainer}>
                            <p className={Styles.soldProducts}>Sold Products: {soldQuantity}</p>
                            <p 
                                className={Styles.seeMore}
                                onClick={() => {dispatch(setActiveProduct(product)); handleSeeMore()}}
                            > See more</p>
                        </div>
                    </div>
                </div>
                <div className={Styles.actions}>
                    { handleAddStock && <button className={Styles.actionButton} onClick={() => { dispatch(setActiveProduct(product)); handleAddStock() }}>Add Stock</button>}
                    <button className={Styles.actionButton} onClick={() => { dispatch(setActiveProduct(product)); handleUpdateDiscounts() }}>Discounts</button>
                    <button className={Styles.actionButton} onClick={() => { dispatch(setActiveProduct(product)); handleUpdate() }}>Update</button>
                    <button className={Styles.actionButtonDelete} onClick={handleDelete}>Delete</button>
                </div>
            </div>
            
        </>
    )
}

export default SellerProductCard