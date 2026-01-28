import baseApi from "@/redux/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (data) => ({
        url: "/payments/initiate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),

    // redux/features/payment/paymentApi.ts
    getPayments: builder.query({
      query: (params) => ({
        url: "/payments",
        params,
      }),
      providesTags: ["Payment"],
    }),

    approvePayment: builder.mutation({
      query: (paymentId: string) => ({
        url: `/payments/${paymentId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useGetPaymentsQuery,
  useApprovePaymentMutation,
} = paymentApi;
