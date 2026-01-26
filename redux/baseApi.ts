import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { IUser, logout, setUser } from "./features/auth/authSlice";
import { RootState } from "./store";

/**
 * ============================
 * Refresh Token API Response
 * ============================
 */
interface IRefreshResponse {
  success: boolean;
  data: {
    user: IUser;
    accessToken: string;
  };
}

/**
 * ============================
 * Mutex (prevent multiple refresh calls)
 * ============================
 */
const mutex = new Mutex();

/**
 * ============================
 * Base Query
 * ============================
 */
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.AFAuth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

/**
 * ============================
 * Base Query with Re-Auth
 * ============================
 */

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh-token", method: "POST" },
          api,
          extraOptions
        );

        const refreshData = refreshResult.data as IRefreshResponse;

        if (refreshData?.data?.accessToken) {
          // ✅ SAVE NEW TOKEN
          api.dispatch(
            setUser({
              user: refreshData.data.user,
              accessToken: refreshData.data.accessToken,
            })
          );

          // ✅ RETRY ORIGINAL REQUEST WITH NEW TOKEN
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

/**
 * ============================
 * Base API
 * ============================
 */
const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Auth", "Project", "Banner", "Payment"],
  endpoints: () => ({}),
});

export default baseApi;
