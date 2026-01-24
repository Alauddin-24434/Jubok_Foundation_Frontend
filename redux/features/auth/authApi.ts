// ====================================================
// 🧾 Auth API Module - User Authentication & Management
// ====================================================

import baseApi from "@/redux/baseApi";

// ===== 🔹 Inject auth-related endpoints into baseApi =====
const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ===== ✅ Signup user =====
    signUpUser: build.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    // ===== ✅ Login user =====
    loginUser: build.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",

        body,
      }),
    }),

    // ===== ✅ Get current logged-in user info =====
    getMe: build.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // ===== ✅ Get all users (admin access) with filters =====
    getUsers: build.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.searchTerm)
          queryParams.append("searchTerm", params.searchTerm);
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        return {
          url: `users/?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Auth"],
    }),

    // ===== ✅ Get stats =====
    getStats: build.query({
      query: () => ({
        url: `/auth/stats`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // ===== ✅ Update a user (partial update with PATCH) =====
    updateUser: build.mutation({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

// =====  Export auto-generated hooks =====
export const {
  useSignUpUserMutation,
  useLoginUserMutation,
  useGetMeQuery,
  useGetUsersQuery,
  useGetStatsQuery,
  useUpdateUserMutation,
} = authApi;

export default authApi;