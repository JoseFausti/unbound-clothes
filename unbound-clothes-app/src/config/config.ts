export const frontendUrl = import.meta.env.VITE_FRONTEND_URL as string;
export const apiUrl = import.meta.env.VITE_API_URL as string;

// Mercadopago configuration
import { initMercadoPago } from '@mercadopago/sdk-react';
initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY as string);

// Google configuration
export const googleConfig = {
    apiUrl: apiUrl,
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string
};

