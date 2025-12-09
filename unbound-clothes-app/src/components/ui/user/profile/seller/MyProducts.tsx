import { Navigate, useSearchParams } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";
import Styles from "./MyProducts.module.css"
import SellerProductsList from "./SellerProductsList";
import SellerProductCard from "./SellerProductCard";
import { useAppSelector } from "../../../../../hooks/redux";
import Error from "../../../error/Error";
import { useEffect, useState } from "react";
import CreateProduct from "./actions/CreateProduct";
import UpdateProduct from "./actions/UpdateProduct";
import AddStockProduct from "./actions/AddStockProduct";
import UpdateDiscounts from "./actions/UpdateDiscounts";
import axiosInstance from "../../../../../config/axios";
import type { IProduct, IProductVariant } from "../../../../../types/schemas.db";
import SoldVariantsModal from "./actions/SoldVariantsModal";

const MyProducts = () => {

  const { user } = useAuth();
  
  const {products, productActive} = useAppSelector(state => state.products);
  const p = useSearchParams()[0].get("p");
  const product = products.find(product => product.id === p);
  
  const [modal, setModal] = useState({
    create: false,
    update: false,
    addStock: false,
    updateDiscounts: false,
    soldVariants: false
  })
  
  const handleCreate = () => setModal({create: true, update: false, addStock: false, updateDiscounts: false, soldVariants: false})
  const handleUpdate = () => setModal({create: false, update: true, addStock: false, updateDiscounts: false, soldVariants: false})
  const handleAddStock = () => setModal({create: false, update: false, addStock: true, updateDiscounts: false, soldVariants: false})
  const handleUpdateDiscounts = () => setModal({create: false, update: false, addStock: false, updateDiscounts: true, soldVariants: false});
  const handleSeeMore = () => setModal({create: false, update: false, addStock: false, updateDiscounts: false, soldVariants: true});

  const closeModal = () => setModal({create: false, update: false, addStock: false, updateDiscounts: false, soldVariants: false});

  const [soldProducts, setSoldProducts] = useState<{
    product: Omit<IProduct, "likedBy" | "discounts" | "variants">,
    variants: (Pick<IProductVariant, "id" | "color" | "size" | "stock"> & { quantity: number })[],
    totalQuantity: number
  }[]>();
  
  useEffect(() => {
    const getSoldProducts = async () => {
      try {
        const response = await axiosInstance.get<{
          product: Omit<IProduct, "likedBy" | "discounts" | "variants">,
          variants: (Pick<IProductVariant, "id" | "color" | "size" | "stock"> & { quantity: number })[],
          totalQuantity: number
        }[]>(`/orders/user/${user?.id}/sold`);
        setSoldProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSoldProducts();
  }, [user?.id]);
  
  if (!user || user.role !== "SELLER") return <Navigate to="/profile" replace />;
  
  const sellerProducts = products.filter(product => product.sellerId === user.id);
  
  return (
    <>
      {modal.create || modal.update || modal.addStock || modal.updateDiscounts || modal.soldVariants
        ?
        <>
          {modal.create && <CreateProduct closeModal={closeModal} />}
          {modal.update && <UpdateProduct closeModal={closeModal} product={productActive!} />}
          {modal.addStock && <AddStockProduct closeModal={closeModal} product={productActive!} />}
          {modal.updateDiscounts && <UpdateDiscounts closeModal={closeModal} product={productActive!} />}
          {modal.soldVariants && <SoldVariantsModal closeModal={closeModal} productName={productActive!.name} variants={soldProducts?.find(s => s.product.id === productActive?.id)?.variants ?? []} />}
        </>
        :
        <>
          { p 
            ? 
              product 
              ?
              <div className={Styles.sellerProductsListContainer}>
                <SellerProductCard 
                  key={p} 
                  product={product} 
                  soldQuantity={soldProducts?.find(soldProduct => soldProduct.product.id === product.id)?.totalQuantity ?? 0}
                  handleUpdate={handleUpdate}
                  handleAddStock={handleAddStock}
                  handleUpdateDiscounts={handleUpdateDiscounts}
                  handleSeeMore={handleSeeMore}
                />
              </div>
              : <Error />
            :
              sellerProducts.length > 0 
              ? 
                <SellerProductsList 
                  products={sellerProducts} 
                  soldProducts={soldProducts}
                  handleCreate={handleCreate}
                  handleUpdate={handleUpdate}
                  handleAddStock={handleAddStock}
                  handleUpdateDiscounts={handleUpdateDiscounts}
                  handleSeeMore={handleSeeMore}
                />
              : 
                <div className={Styles.emptyState}>
                  <h2 className={Styles.productsTitle}>My Products</h2>
                  <p className={Styles.productsDescription}>
                    Your list of your products will appear here.
                  </p>
                  <div className={Styles.createButtonContainer}>
                    <button className={Styles.createButton} onClick={handleCreate}>Let´s Start</button>
                  </div>
                </div>
          }
        </>
      }
    </>
  )
}

export default MyProducts
