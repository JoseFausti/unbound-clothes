import type { IProduct, IProductVariant } from "../../../../../types/schemas.db";
import SellerProductCard from "./SellerProductCard";
import Styles from "./SellerProductsList.module.css"

interface SellerProductsListProps {
  products: IProduct[];
  soldProducts: {
    product: Omit<IProduct, "likedBy" | "discounts" | "variants">,
    variants: (Pick<IProductVariant, "id" | "color" | "size"> & { quantity: number })[],
    totalQuantity: number;
  }[] | undefined;
  handleCreate?: () => void;
  handleUpdate: () => void;
  handleAddStock?: () => void;
  handleUpdateDiscounts: () => void;
  handleSeeMore: () => void;
}

const SellerProductsList: React.FC<SellerProductsListProps> = ({ products, soldProducts, handleCreate, handleUpdate, handleAddStock, handleUpdateDiscounts, handleSeeMore }) => {

  return (
    <div className={Styles.sellerProductsListContainer}>
        {handleCreate && 
          <div className={Styles.createButtonContainer}>
            <button className={Styles.createButton} onClick={handleCreate}>Create Product</button>
          </div>
        }
        {products.map((product) => (
            <SellerProductCard 
                key={product.id} 
                product={product}
                soldQuantity={soldProducts?.find(soldProduct => soldProduct.product.id === product.id)?.totalQuantity ?? 0}
                handleUpdate={handleUpdate}
                handleAddStock={handleAddStock}
                handleUpdateDiscounts={handleUpdateDiscounts}
                handleSeeMore={handleSeeMore}
            />
        ))}
    </div>
  )
}

export default SellerProductsList
