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
    getFundHistory: builder.query<any[], { limit?: number }>({
      query: ({ limit = 20 }) => `/funds/history?limit=${limit}`,
      providesTags: ["Fund"], // 👈 IMPORTANT
    }),
  }),
});

export const {
  useGetFundSummaryQuery,
  useGetFundHistoryQuery,
  useAddFundTransactionMutation,
} = fundApi;
