import { useEffect, useState } from "react";
import axiosInstance from "../../../../../config/axios";
import type { IProduct, IProductVariant } from "../../../../../types/schemas.db";
import Styles from "./AdminSellerProducts.module.css";
import Loader from "../../../loader/Loader";
import SellerProductsList from "../../../user/profile/seller/SellerProductsList";
import Error from "../../../error/Error";
import UpdateProduct from "../../../user/profile/seller/actions/UpdateProduct";
import UpdateDiscounts from "../../../user/profile/seller/actions/UpdateDiscounts";
import SoldVariantsModal from "../../../user/profile/seller/actions/SoldVariantsModal";
import { useAppSelector } from "../../../../../hooks/redux";

interface Props {
  userId: string;
  closeModal: () => void;
}

const AdminSellerProducts: React.FC<Props> = ({ userId, closeModal }) => {

  const { productActive } = useAppSelector(state => state.products);

  const [productsByUser, setProductsByUser] = useState<IProduct[]>();
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [soldProducts, setSoldProducts] = useState<({
    product: Omit<IProduct, "likedBy" | "discounts" | "variants">,
    variants: (Pick<IProductVariant, "id" | "color" | "size" | "stock"> & { quantity: number })[],
    totalQuantity: number
  }[])>();

  const [modal, setModal] = useState({
    update: false,
    updateDiscounts: false,
    soldVariants: false,
  });

  const handleUpdate = () => setModal({ update: true, updateDiscounts: false, soldVariants: false });
  const handleUpdateDiscounts = () => setModal({ update: false, updateDiscounts: true, soldVariants: false });
  const handleSeeMore = () => setModal({ update: false, updateDiscounts: false, soldVariants: true });
  
  const closeAll = () => setModal({ update: false, updateDiscounts: false, soldVariants: false });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get<IProduct[]>(`/products/user/${userId}`);
        setProductsByUser(res.data);
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchSold = async () => {
      try {
        const res = await axiosInstance.get<{
          product: Omit<IProduct, "likedBy" | "discounts" | "variants">,
          variants: (Pick<IProductVariant, "id" | "color" | "size" | "stock"> & { quantity: number })[],
          totalQuantity: number
        }[]>(`/orders/user/${userId}/sold`);
        setSoldProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
    fetchSold();
  }, [userId]);

  if (loadingProducts) return <Loader />;
  if (!productsByUser) return <Error />;

  return (
    <div className={Styles.container}>
      
      <button className={Styles.back} onClick={closeModal}>
        X
      </button>

      {modal.update || modal.updateDiscounts || modal.soldVariants 
        ? (
            <>
                {modal.update && <UpdateProduct closeModal={closeAll} product={productActive!} />}
                {modal.updateDiscounts && 
                    <UpdateDiscounts 
                        closeModal={closeAll} 
                        product={productActive!} 
                        onUpdated={(updated) => {
                            setProductsByUser(prev =>
                                prev!.map(p => p.id === updated.id ? updated : p)
                            );
                        }} 
                    />
                }
                {modal.soldVariants && <SoldVariantsModal closeModal={closeAll} productName={productActive!.name} variants={soldProducts?.find((s) => s.product.id === productActive?.id)?.variants ?? []} />}
            </>
        ) : (
            <>
                <SellerProductsList
                    products={productsByUser}
                    soldProducts={soldProducts}
                    handleUpdate={() => handleUpdate()}
                    handleUpdateDiscounts={() => handleUpdateDiscounts()}
                    handleSeeMore={() => handleSeeMore()}
                />
            </>
        )}
    </div>
  );
};

export default AdminSellerProducts;
