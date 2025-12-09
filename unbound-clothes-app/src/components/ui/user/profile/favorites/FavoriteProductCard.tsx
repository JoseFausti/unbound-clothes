import { Heart } from "lucide-react";
import Styles from "./FavoriteProductCard.module.css";
import { Link } from "react-router-dom";
import type { IProduct } from "../../../../../types/schemas.db";
import useAuth from "../../../../../hooks/useAuth";
import { useAppDispatch } from "../../../../../hooks/redux";
import { toggleFavorite } from "../../../../../store/slices/userSlice";
import { calculateFinalProductPrice, errorBanner } from "../../../../../utils/functions";

const FavoriteProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();

    const { original, final, hasDiscount } = calculateFinalProductPrice(product);

    const isFavorite = !!user?.favorites?.some((fav) => fav.id === product.id);

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return await errorBanner();
        dispatch(toggleFavorite(product));
    };

    return (
        <div className={Styles.card}>
            <Link to={`/products/${product.id}`} className={Styles.link} >
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
                </div>
            </Link>
            <div className={Styles.heartContainer}>
                <Heart
                    onClick={handleClick}
                    className={Styles.heart}
                    style={{
                        color: isFavorite ? "red" : "var(--text-color)",
                        fill: isFavorite ? "red" : "transparent",
                        cursor: "pointer",
                    }}
                />
            </div>
        </div>
    );
};

export default FavoriteProductCard;
