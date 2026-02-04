import baseApi from "@/redux/baseApi";

export const fundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ ADD TRANSACTION
    addFundTransaction: builder.mutation<
      any,
      {
        type: "INCOME" | "EXPENSE";
        amount: number;
        reason: string;
      }
    >({
      query: (data) => ({
        url: "/funds/transaction",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fund"], // 👈 this will now work
    }),

    // ✅ FUND SUMMARY
    getFundSummary: builder.query<
      {
        totalIncome: number;
        totalExpense: number;
        currentBalance: number;
      },
      void
    >({
      query: () => "/funds/summary",
      providesTags: ["Fund"], // 👈 IMPORTANT
      keepUnusedDataFor: 60,
    }),

    // ✅ FUND HISTORY
    getFundHistory: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => `/funds/history?page=${page}&limit=${limit}`,
      providesTags: ["Fund"],
    }),

    // 📝 GET EXPENSE REQUESTS
    getExpenseRequests: builder.query<any[], { status?: string } | void>({
      query: (params) => {
        const url = params?.status
          ? `/funds/requests?status=${params.status}`
          : "/funds/requests";
        return { url };
      },
      providesTags: ["Fund"],
    }),

    // ✅ APPROVE EXPENSE
    approveExpense: builder.mutation<any, string>({
      query: (requestId) => ({
        url: `/funds/requests/${requestId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Fund"],
    }),

    // ❌ REJECT EXPENSE
    rejectExpense: builder.mutation<any, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/funds/requests/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Fund"],
    }),
  }),
});

export const {
  useGetFundSummaryQuery,
  useGetFundHistoryQuery,
  useAddFundTransactionMutation,
  useGetExpenseRequestsQuery,
  useApproveExpenseMutation,
  useRejectExpenseMutation,
} = fundApi;
