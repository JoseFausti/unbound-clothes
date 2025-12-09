import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import { getAllProducts } from "../../../store/slices/productsSlice";
import Loader from "../../ui/loader/Loader";
import Error from "../../ui/error/Error";
import Landing from "../../ui/home/Landing";

const Home = () => {

  const dispatch = useAppDispatch();
  const {products, loading, error} = useAppSelector(state => state.products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch, products.length]);

  return (
    <>
      {loading && <Loader />}
      {!loading && error && <Error />}
      {!loading && !error && <Landing products={products} />}
    </>
  )
}

export default Home;
