"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { saveState } from "@/redux/localStorage";

store.subscribe(() => {
  saveState(store.getState().store);
});

export default function StateWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Provider store={store}>{children}</Provider>;
}
