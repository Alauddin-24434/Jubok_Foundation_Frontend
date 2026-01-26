import baseApi from "../../baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: "/payments/verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),
    initiatePayment: builder.mutation({
      query: (data) => ({
        url: "/payments/initiate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),
    approvePayment: builder.mutation({
      query: (id) => ({
        url: `/payments/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payment", "User"], // Activates user too
    }),
    getMyPayments: builder.query({
      query: () => ({
        url: "/payments/my-payments",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
    getPendingMembershipPayments: builder.query({
      query: () => ({
        url: "/payments/admin/pending-membership",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
  }),
});

export const {
  useVerifyPaymentMutation,
  useInitiatePaymentMutation,
  useApprovePaymentMutation,
  useGetMyPaymentsQuery,
  useGetPendingMembershipPaymentsQuery,
} = paymentApi;
