import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../hooks/redux';
import useAuth from '../../../../hooks/useAuth';
import { useVariant } from '../../../../hooks/useVariant'
import { addToCart } from '../../../../store/slices/cartSlice';
import type { IProduct } from '../../../../types/schemas.db'
import { addToCartBanner, calculateFinalProductPrice } from '../../../../utils/functions';
import Loader from '../../loader/Loader';
import Styles from './ProductView.module.css'

interface Props {
  product: IProduct
}

const ProductView: React.FC<Props> = ({ product }) => {
  const {
    quantity, selectedSize, selectedColor, selectedVariant, uniqueSizes, uniqueColors,
    setSelectedSize, setSelectedColor, increaseQuantity, decreaseQuantity,
  } = useVariant(product);

    const { loading, user } = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {final} = calculateFinalProductPrice(product);

    const handleAddToCart = () => {
        if (!user) return navigate("/login", { replace: true })
        if (!selectedVariant?.id || selectedVariant.stock <= 0) return;
        dispatch(addToCart({ variant: { ...selectedVariant, product}, quantity }));
        addToCartBanner()
    };

    if (loading) return <Loader />

     return (
        <div className={Styles.productViewWrapper}>
            <div className={Styles.productViewContainer}>
                <div className={Styles.imageSection}>
                    <div className={Styles.imageContainer}>
                        <img className={Styles.image} src={product.imageUrl} alt={product.name} />
                    </div>
                </div>

                <div className={Styles.infoSection}>
                    <p className={Styles.brand}>Unbound</p>
                    <h1 className={Styles.name}>{product.name}</h1>
                    <p className={Styles.price}>{final}</p>

                    <p className={Styles.description}>{product.description}</p>

                    <div className={Styles.sizes}>
                        <span className={Styles.label}>SIZE:</span>
                        <div className={Styles.sizeButtons}>
                            {uniqueSizes.map(size => (
                                <button
                                    key={size}
                                    className={`${Styles.sizeButton} ${selectedSize === size ? Styles.selected : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                    >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={Styles.colors}>
                        <span className={Styles.label}>COLOR:</span>
                        <div className={Styles.colorButtons}>
                            {uniqueColors.map(color => (
                                <button
                                    key={color}
                                    className={`${Styles.colorButton} ${selectedColor === color ? Styles.selected : ''}`}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    onClick={() => setSelectedColor(color)}
                                />
                            ))}
                        </div>
                    </div>

                    {selectedVariant && selectedVariant.stock > 0 && (
                        <div className={Styles.quantity}>
                            <span className={Styles.label}>QUANTITY:</span>
                            <div className={Styles.quantityControls}>
                                <button onClick={decreaseQuantity}>-</button>
                                <span className={Styles.quantityValue}>{quantity}</span>
                                <button onClick={increaseQuantity}>+</button>
                            </div>
                        </div>
                    )}

                    {user
                        ?
                        user.role === "USER" && (
                            <button 
                                className={Styles.addToCart}
                                onClick={handleAddToCart}
                            >
                                ADD TO CART
                            </button>
                        )
                        : 
                        <button 
                            className={Styles.addToCart}
                            onClick={() => navigate("/login", { replace: true })}
                        >
                            ADD TO CART
                        </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default ProductView;
