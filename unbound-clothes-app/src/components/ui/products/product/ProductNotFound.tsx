import { Link } from "react-router-dom";
import Styles from "./ProductNotFound.module.css";
import { AlertCircle } from "lucide-react"; // icono elegante opcional

const ProductNotFound = () => {
  return (
    <div className={Styles.productNotFoundContainer}>
      <div className={Styles.contentWrapper}>
        <AlertCircle className={Styles.icon} />
        <h1 className={Styles.title}>Product Not Found</h1>
        <p className={Styles.subtitle}>
          We couldn’t find the product you’re looking for.
          <br /> It might have been removed or is temporarily unavailable.
        </p>
        <Link to="/" className={Styles.homeButton}>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ProductNotFound;
