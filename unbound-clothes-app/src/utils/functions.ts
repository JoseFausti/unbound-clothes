import Swal from "sweetalert2";
import { type IProduct, type ITokenPayload, type UserRole } from "../types/schemas.db";
import {jwtDecode} from "jwt-decode"
import type { CartProductPayload } from "../store/slices/cartSlice";
import { store } from "../store/store";

export const isAdmin = (role: UserRole): boolean => {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export const isSuperAdmin = (role: UserRole): boolean => {
  return role === "SUPER_ADMIN";
}

export const getUserFromToken = (token: string) => {
  const decodedUser = jwtDecode<ITokenPayload>(token);
  return decodedUser;
}

// Banners
export const successBanner = async () => {
  return Swal.fire({
    width: '420px',
    icon: 'success',
    iconColor: 'var(--success-color)',
    text: 'Success!',
    background: 'var(--bg-color)',
    color: 'var(--text-color)',
    backdrop: 'var(--box-shadow)',
    padding: '20px',
    confirmButtonColor: 'var(--success-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  });
}
export const errorBanner = async () => {
  return Swal.fire({
    width: '420px',
    icon: 'error',
    iconColor: 'var(--error-color)',
    text: 'Something went wrong! Please try again later.',
    background: 'var(--bg-color)',
    color: 'var(--text-color)',
    backdrop: 'var(--box-shadow)',
    padding: '20px',
    confirmButtonColor: 'var(--error-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  });
}

export const deleteProductBanner = async () => {
  return Swal.fire({
    width: '420px',
    icon: 'question',
    iconColor: 'var(--accent-color)',
    text: 'Are you sure you want to delete this product?',
    background: 'var(--bg-color)',
    color: 'var(--text-color)',
    backdrop: 'var(--box-shadow)',
    padding: '20px',
    showCancelButton: true,
    confirmButtonColor: 'var(--success-color)',
    cancelButtonColor: 'var(--error-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    }
    return false;
  });
}

export const deleteDirectionBanner = async () => {
  return Swal.fire({
    width: '420px',
    icon: 'question',
    iconColor: 'var(--accent-color)',
    text: 'Are you sure you want to delete this direction?',
    background: 'var(--bg-color)',
    color: 'var(--text-color)',
    backdrop: 'var(--box-shadow)',
    padding: '20px',
    showCancelButton: true,
    confirmButtonColor: 'var(--success-color)',
    cancelButtonColor: 'var(--error-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    }
    return false;
  });
}

export const succesPurchaseBanner = async () => {
  return Swal.fire({
    width: '420px',
    icon: 'success',
    iconColor: 'var(--success-color)',
    text: 'Purchase successful! Thank you for your purchase. Check your email for more information.',
    background: 'var(--bg-color)',
    color: 'var(--text-color)',
    backdrop: 'var(--box-shadow)',
    padding: '20px',
    confirmButtonColor: 'var(--success-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  });
}

export const errorPurchaseBanner = async () => {
  return Swal.fire({
    width: '420px',
    icon: 'error',
    iconColor: 'var(--error-color)',
    text: 'We couldn\'t process your purchase! Please try again later.',
    background: 'var(--bg-color)',
    color: 'var(--text-color)',
    backdrop: 'var(--box-shadow)',
    padding: '20px',
    confirmButtonColor: 'var(--error-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  });
}

export const pendingPurchaseBanner = async () => {
  return Swal.fire({
    width: '420px',
    icon: 'info',
    iconColor: 'var(--info-color)',  
    text: 'Your purchase is pending. Check your email for more information.',
    background: 'var(--bg-color)',
    color: 'var(--text-color)',
    backdrop: 'var(--box-shadow)',
    padding: '20px',
    confirmButtonColor: 'var(--accent-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  });
}

export const deleteHistoryBanner = async () => {
  return Swal.fire({
    width: '420px',
    icon: 'question',
    iconColor: 'var(--accent-color)',
    text: 'Are you sure you want to delete this history?',
    background: 'var(--bg-color)',
    color: 'var(--text-color)',
    backdrop: 'var(--box-shadow)',
    padding: '20px',
    confirmButtonColor: 'var(--accent-color)',
    showDenyButton: true,
    denyButtonColor: 'var(--error-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    }
    return false;
  });
}

export const deleteOrderBanner = async () => {
  return Swal.fire({
    width: '420px',
    icon: 'question',
    iconColor: 'var(--accent-color)',
    text: 'Are you sure you want to delete this order?',
    background: 'var(--bg-color)',
    color: 'var(--text-color)',
    backdrop: 'var(--box-shadow)',
    padding: '20px',
    showCancelButton: true,
    confirmButtonColor: 'var(--success-color)',
    cancelButtonColor: 'var(--error-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    }
    return false;
  });
}

export const logoutBanner = async (logout: () => void) => {
  return Swal.fire({
    width: '420px',
    icon: 'question',
    iconColor: 'var(--text-color)',
    text: 'Are you sure you want to logout?',
    background: 'var(--bg-color)',
    color: 'var(--text-color)',
    backdrop: 'var(--box-shadow)',
    padding: '20px',
    showCancelButton: true,
    confirmButtonColor: 'var(--success-color)',
    cancelButtonColor: 'var(--error-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  }).then((result) => {
    if (result.isConfirmed) {
      logout();
    }
  })
}

export const wrongUserBanner = async () => {
  return Swal.fire({
    width: '420px',
    text: 'User or password incorrect. Please try again.',
    color: 'var(--text-color)',
    confirmButtonColor: 'var(--accent-color)',
    background: 'var(--bg-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  });
}

export const logfavoritesBanner = async () => {
  return Swal.fire({
    width: '420px',
    text: 'Log in to add to favorites!',
    color: 'var(--text-color)',
    confirmButtonColor: 'var(--accent-color)',
    background: 'var(--bg-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  });
}

export const addToCartBanner = async () => {
  return Swal.fire({
    width: '420px',
    text: 'Product added to cart!',
    color: 'var(--text-color)',
    confirmButtonColor: 'var(--accent-color)',
    background: 'var(--bg-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  });
}

export const deleteUserBanner = async () => {
  return Swal.fire({
    width: '420px',
    icon: 'question',
    iconColor: 'var(--accent-color)',
    text: 'Are you sure you want to delete this user?',
    background: 'var(--bg-color)',
    color: 'var(--text-color)',
    backdrop: 'var(--box-shadow)',
    padding: '20px',
    showCancelButton: true,
    confirmButtonColor: 'var(--success-color)',
    cancelButtonColor: 'var(--error-color)',
    showClass: { popup: '' },
    hideClass: { popup: '' } 
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    }
    return false;
  });
}

// Cart
export const calculateTotalPrice = (cart: CartProductPayload[]) => {
    const total = cart.reduce((acc, item) => {
      // Total active discounts
      const totalDiscount = item.variant.product.discounts
        .reduce((sum, discount) => sum + discount.percentage, 0);

      // Limit 100%
      const discountFactor = Math.min(totalDiscount, 100) / 100;

      // Price after discount
      const priceAfterDiscount = item.variant.product.price * (1 - discountFactor);

      // Accumulate total
      return acc + priceAfterDiscount * item.quantity;
    }, 0);

    return total;
}

export const calculateFinalProductPrice = (product: IProduct) => {
  const now = new Date();

  const activeDiscounts = product.discounts?.filter(discount => {
    const start = new Date(discount.startDate);
    const end = new Date(discount.endDate);
    return start <= now && now <= end;
  }) ?? [];

  const totalDiscount = activeDiscounts.reduce(
    (acc, discount) => acc + discount.percentage,
    0
  );

  const hasDiscount = totalDiscount > 0;

  const discountFactor = Math.min(totalDiscount / 100, 1);
  const finalPrice = product.price * (1 - discountFactor);

  return {
    original: "$ " + product.price.toFixed(2),
    final: "$ " + (finalPrice <= 0 ? "Free" : finalPrice.toFixed(2)),
    hasDiscount,
  };
};



// Helpers
export const getProductAndVariant = (variantId: string) => {
  const {products} = store.getState().products
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === variantId)
    if (variant) return { product, variant }
  }
  return null
}

export const getDirection = (directionId: string) => {
  const {user} = store.getState().user
  if (!user) return null
  for (const direction of user.directions) {
    if (direction.id === directionId) return direction
  }
  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shuffle = (array: Array<any>) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
