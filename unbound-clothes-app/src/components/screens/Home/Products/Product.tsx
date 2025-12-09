import { useParams } from "react-router-dom"
import ProductView from "../../../ui/products/product/ProductView"
import { useAppSelector } from "../../../../hooks/redux";
import ProductNotFound from "../../../ui/products/product/ProductNotFound";

const Product = () => {

  const { id } = useParams();
  const {products} = useAppSelector(state => state.products);
  const product = products.find(product => product.id === id);

  if (!product) return <ProductNotFound />
  return <ProductView product={product} />
}

export default Product
