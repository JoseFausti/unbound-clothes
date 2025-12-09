import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import Error from "../error/Error";
import Loader from "../loader/Loader";
import Style from "./CartSummary.module.css";
import axiosInstance from "../../../config/axios";
import { errorBanner } from "../../../utils/functions";
import { useState } from "react";
import type { MpPreferenceResponse } from "../../../types/schemas.mp";
import PaymentBrick from "./PaymentBrick";
import { decrementQuantity, incrementQuantity } from "../../../store/slices/cartSlice";
import { ShoppingCart, ArrowRight } from "lucide-react";
import SelectAddressMenu from "../address/SelectAddressMenu";
import type { IDirection } from "../../../types/schemas.db";

const CartSummary = () => {
  const { cartId, cart, loading, error } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [preferenceId, setPreferenceId] = useState<string>("");

  const [checkoutMenuOpen, setCheckoutMenuOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<IDirection | undefined>(undefined);

  const closeModal = () => setCheckoutMenuOpen(false);

  const handlePurchase = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (!cartId || cart.length === 0) return;

      const resCart = await axiosInstance.put(`/cart/${cartId}`, {
        cartItems: cart.map((item) => ({
          variantId: item.variant?.id,
          quantity: item.quantity,
        })),
      });

      if (resCart.data) {
        const resMp = await axiosInstance.post<MpPreferenceResponse>(`/mp/${cartId}`, {
          directionId: selectedAddress!.id,
          // shippingCost:
        }
        );
        if (resMp.data.id) {
          setPreferenceId(resMp.data.id);
        } else {
          errorBanner();
        }
      }
    } catch {
      errorBanner();
    }
  };

  const totalCartAmount = cart.reduce((acc, item) => {
    const totalDiscount =
      item.variant?.product.discounts?.reduce((sum, discount) => sum + discount.percentage / 100, 0) ?? 0;

    const discountedPrice = item.variant?.product.price * (1 - totalDiscount);
    return acc + discountedPrice * item.quantity;
  }, 0);

  if (loading) return <Loader />;
  if (error) return <Error />;

  return (
    <>
      {preferenceId && selectedAddress ? (
        <div className={Style.paymentBrickContainer}>
          <PaymentBrick 
            amount={totalCartAmount} 
            directionId={selectedAddress.id}
            preferenceId={preferenceId} 
          />
        </div>
      ) : (
        <>
          {checkoutMenuOpen
            ? 
            <SelectAddressMenu 
              closeModal={closeModal} 
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              handlePurchase={handlePurchase} 
            />
            :
            <div className={Style.cartSummaryContainer}>
              <div className={Style.cartSummaryHeader}>
                <ShoppingCart className={Style.cartIcon} />
                <h2 className={Style.cartSummaryTitle}>Your Cart</h2>
              </div>

              <div className={Style.cartSummaryCard}>
                {cart.length === 0 ? (
                  <p className={Style.emptyCartText}>Your cart is empty</p>
                ) : (
                  <>
                    <div className={Style.cartSummaryContent}>
                      {cart.map((item) => {
                        const totalDiscount =
                          item.variant?.product.discounts?.reduce(
                            (sum, discount) => sum + discount.percentage / 100,
                            0
                          ) ?? 0;

                        const discountedPrice = item.variant?.product.price * (1 - totalDiscount);
                        const subtotal = discountedPrice * item.quantity;

                        return (
                          <div key={`${item.variant.id}-${item.variant.color}-${item.variant.size}`} className={Style.cartItem}>
                            <div className={Style.cartItemImageContainer}>
                              <img
                                src={item.variant?.product.imageUrl}
                                alt={item.variant?.product.name}
                                className={Style.cartItemImage}
                              />
                            </div>

                            <div className={Style.cartItemInfo}>
                              <h3 className={Style.cartItemName}>{item.variant?.product.name}</h3>
                              <p className={Style.cartItemPrice}>
                                ${subtotal.toFixed(2)}
                                {totalDiscount > 0 && (
                                  <span className={Style.discountTag}>
                                    -{Math.round(totalDiscount * 100)}%
                                  </span>
                                )}
                              </p>
                            </div>

                            <div className={Style.cartItemQuantity}>
                              <button
                                className={Style.quantityButton}
                                onClick={() => dispatch(decrementQuantity(item))}
                              >
                                -
                              </button>
                              <p>{item.quantity}</p>
                              <button
                                className={Style.quantityButton}
                                onClick={() => dispatch(incrementQuantity(item))}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className={Style.totalAmount}>
                      <span>Total:</span>
                      <strong>${totalCartAmount.toFixed(2)}</strong>
                    </div>

                    <button className={Style.goToPurchaseButton} onClick={()=> setCheckoutMenuOpen(true)}>
                      Proceed to Checkout <ArrowRight className={Style.checkoutIcon} />
                    </button>
                  </>
                )}
              </div>
            </div>
          }
        </>
      )}
    </>
  );
};

export default CartSummary;
