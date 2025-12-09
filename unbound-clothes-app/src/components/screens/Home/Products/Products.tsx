import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import Loader from "../../../ui/loader/Loader";
import Error from "../../../ui/error/Error";
import ProductsList from "../../../ui/products/ProductsList";
import { useEffect } from "react";
import { getAllProducts } from "../../../../store/slices/productsSlice";

const Products = () => {

  const location = useLocation();

  const dispatch = useAppDispatch();
  const {products, loading, error} = useAppSelector(state => state.products);

  const q = new URLSearchParams(location.search).get("q");
  const category = new URLSearchParams(location.search).get("category");

  useEffect(() => {
    if (products.length === 0) dispatch(getAllProducts());
  }, [dispatch, products.length]);

  return (
    <>
      {loading && <Loader />}
      {(error || !products.length) && <Error />}
      {q && products.length > 0 && 
        <ProductsList products={products.filter(product => product.name.toLowerCase().includes(q.toLowerCase()))} />
      }
      {category && products.length > 0 && 
        <ProductsList products={products.filter(product => product.category === category)} />
      }
      {!q && !category && products.length > 0 && 
        <ProductsList products={products} />
      }
    </>
  )
}

export default Products
