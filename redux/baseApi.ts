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
  // console.log("➡️ API Request Started:", args);

  // wait if another refresh is running
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);
  // console.log(result)

  // if (result.error) {
  //   console.error("❌ API Error:", {
  //     url: args,
  //     status: result.error.status,
  //     error: result.error,
  //   });
  // }

  if (result.error?.status === 401) {
    // console.warn("🔐 401 Unauthorized detected");

    if (!mutex.isLocked()) {
      // console.log("🔓 Mutex free → acquiring lock");
      const release = await mutex.acquire();

      try {
        // console.log("🔄 Calling refresh-token API");

        const refreshResult = await baseQuery(
          { url: "/auth/refresh-token", method: "POST" },
          api,
          extraOptions
        );

        // console.log("📦 Refresh response:", refreshResult);

        const refreshData = refreshResult.data as IRefreshResponse;

        if (refreshData?.data?.accessToken) {
          // console.log("✅ New access token received");

          api.dispatch(
            setUser({
              user: refreshData.data.user,
              accessToken: refreshData.data.accessToken,
            })
          );

          // console.log("🔁 Retrying original request");
          result = await baseQuery(args, api, extraOptions);
        } else {
          // console.error("🚫 Refresh failed → logging out");
          api.dispatch(logout());
        }
      } catch (err) {
        // console.error("💥 Refresh token error:", err);
        api.dispatch(logout());
      } finally {
        // console.log("🔓 Releasing mutex lock");
        release();
      }
    } else {
      // console.log("⏳ Waiting for ongoing refresh to finish");
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  console.log("✅ API Request Finished:", args);
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
  tagTypes: ["User", "Auth", "Project", "Banner", "Payment", "Fund", "Management"],
  endpoints: () => ({}),
});

export default baseApi;
