import { useEffect } from "react";
import { useAppDispatch } from "../../../../../hooks/redux";
import useAuth from "../../../../../hooks/useAuth";
import FavoriteProductCard from "./FavoriteProductCard";
import Styles from "./FavoriteProducts.module.css";
import { syncFavorites } from "../../../../../store/slices/userSlice";

const FavoriteProducts = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => { // ComponentWillUnmount
        if (!user) return;
        if (user.role === "USER") dispatch(syncFavorites(user.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const favorites = user?.favorites || [];

  return (
    <div className={Styles.favoriteProductsWrapper}>
      {favorites.length ? (
        <>
          <div className={Styles.favoriteProductsContainer}>
            {favorites.map((favorite) => (
              <FavoriteProductCard key={favorite.id} product={favorite} />
            ))}
          </div>
        </>
      ) : (
        <div className={Styles.emptyState}>
          <h2 className={Styles.favoriteProductsTitle}>Favorite Products</h2>
          <p className={Styles.favoriteProductsDescription}>
            Your list of favorite products will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoriteProducts;
