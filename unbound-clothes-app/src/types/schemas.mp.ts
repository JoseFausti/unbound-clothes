import type { IPaymentBrickCustomization } from "@mercadopago/sdk-react/esm/bricks/payment/type";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type MpInitialization =  {
  amount: number;
  preferenceId?: string;
};

export type PaymentMethods = "all" | "none";

export type MpCustomization = IPaymentBrickCustomization & {
  paymentMethods: {
    ticket: PaymentMethods;
    creditCard: PaymentMethods;
    prepaidCard: PaymentMethods;
    debitCard: PaymentMethods;
    mercadoPago: PaymentMethods;
  };
};

export type MpPreferenceResponse = {
  id?: string;
  // Checkout Pro
  init_point?: string; 
  sandbox_init_point?: string;
};

export type MpOnSubmit = (args: {
  selectedPaymentMethod: { type: string; id?: string };
  formData: Record<string, any>;
}) => Promise<void>;

export type MpOnError = (error: any) => Promise<void>;

export type MpOnReady = () => Promise<void>;
