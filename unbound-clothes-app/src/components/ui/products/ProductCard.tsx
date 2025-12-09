import type { IProduct, UserRole } from "../../../types/schemas.db"
import Styles from "./ProductCard.module.css"
import { Link } from "react-router-dom";
import { Heart } from "lucide-react"
import useAuth from "../../../hooks/useAuth";
import { useAppDispatch } from "../../../hooks/redux";
import { toggleFavorite } from "../../../store/slices/userSlice";
import { calculateFinalProductPrice, logfavoritesBanner } from "../../../utils/functions";
import Loader from "../loader/Loader";

interface ProductCardProps {
    product: IProduct;
}
const ProductCard: React.FC<ProductCardProps> = ({product}) => {

  const { user, loading } = useAuth();
  const dispatch = useAppDispatch();

  const isFavorite = !!user?.favorites?.some((fav) => fav.id === product.id);
  const { original, final, hasDiscount } = calculateFinalProductPrice(product);

  const redirectByUserRole = (role: UserRole) => {
    if (role === "SELLER" && user?.sellerProducts?.some(p => p.id === product.id)) return `/profile/myProducts?p=${product.id}`;
    else  return `/products/${product.id}`;
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return await logfavoritesBanner();
    dispatch(toggleFavorite(product));
  }

  if (loading) return <Loader />

  return (
    <div className={Styles.card}>
      {user 
        ? 
        <Link to={`${redirectByUserRole(user!.role)}`} onClick={(e) => e.stopPropagation()} className={Styles.imageContainer}>
          <img src={product.imageUrl} alt={product.name} className={Styles.image} />
        </Link>
        :
        <Link to={`/products/${product.id}`} className={Styles.imageContainer}>
          <img src={product.imageUrl} alt={product.name} className={Styles.image} />
        </Link>
      }
      <div className={Styles.content}>
        <h3 className={Styles.title}>{product.name}</h3>
        <div className={Styles.priceContainer}>
          <p className={Styles.price}>{final}</p>
          {hasDiscount && <p className={Styles.oldPrice}>{original}</p>}
        </div>
        <p className={Styles.description}>{product.description}</p>
      </div>
      {user && user.role === "USER" && 
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
      }
    </div>
  )
}

export default ProductCard
