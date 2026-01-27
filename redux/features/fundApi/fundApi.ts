import baseApi from "@/redux/baseApi";

// ✅ Fund API
export const fundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFundSummary: builder.query<{
      totalIncome: number;
      totalExpense: number;
      currentBalance: number;
    }, void>({
      query: () => '/funds/summary',
      keepUnusedDataFor: 60, // cache 1 min
    }),

    getFundHistory: builder.query<any[], { limit?: number }>({
      query: ({ limit = 20 }) => `/funds/history?limit=${limit}`,
    }),
  }),
});

export const {
  useGetFundSummaryQuery,
  useGetFundHistoryQuery,
} = fundApi;
