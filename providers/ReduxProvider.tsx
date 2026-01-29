"use client";

import React, { ReactNode, FC } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider: FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      {/* You can put a spinner or loading UI instead of null */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
