import baseApi from "@/redux/baseApi";
import { setUser, updateUser } from "./authSlice";

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

    getMe: build.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.user && data?.data?.accessToken) {
            dispatch(
              setUser({
                user: data.data.user,
                accessToken: data.data.accessToken,
              })
            );
          } else if (data?.data?.user) {
            dispatch(updateUser(data.data.user));
          } else if (data?.data?._id) {
            // If data itself is the user object
            dispatch(updateUser(data.data));
          }
        } catch (error) {
          console.error("Error syncing user data:", error);
        }
      },
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

    // ===== ✅ Logout user =====
    logoutUser: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
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
  useLogoutUserMutation,
} = authApi;

export default authApi;
