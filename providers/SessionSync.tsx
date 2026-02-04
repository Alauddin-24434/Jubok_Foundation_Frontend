"use client";

import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/auth/authApi";

interface SessionSyncProps {
  children: ReactNode;
}

/**
 * SessionSync handles the global synchronization of user state.
 * It ensures that the Redux store (which might have stale persisted data)
 * stays in sync with the server, especially after role changes or status updates.
 */
export const SessionSync = ({ children }: SessionSyncProps) => {
  const user = useSelector(selectCurrentUser);

  // We call getMe query. 
  // It has a lifecycle hook (onQueryStarted) that automatically updates the store.
  // We only run this if we have a user in the store (meaning they are logged in).
  const { isFetching } = useGetMeQuery(undefined, {
    skip: !user,
    // This ensures we always get the latest data when the app mounts
    refetchOnMountOrArgChange: true, 
  });

  return <>{children}</>;
};
