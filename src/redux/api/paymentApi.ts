import { baseApi } from "./baseApi";

export interface CreateOrderRequest {
  /** Amount in the currency's smallest unit (paise for INR, cents for USD).
   *  Backend enforces a 100 minimum. */
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, unknown>;
  customer?: { name?: string; email?: string; contact?: string };
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: string;
  amount: number;
  currency: string;
  receipt?: string;
  /** Razorpay public key id, returned so the frontend doesn't need its own
   *  copy in env. KEY_SECRET stays server-side. */
  key_id: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  order_id: string;
  payment_id: string;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (body) => ({
        url: "/create-order",
        method: "POST",
        body,
      }),
    }),
    verifyPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentRequest>({
      query: (body) => ({
        url: "/verify-payment",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useVerifyPaymentMutation } = paymentApi;
