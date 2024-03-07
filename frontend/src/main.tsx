import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { saveState } from "./localStorage.js";

// TODO: Add logic to save the state in local storage using store.subscribe
store.subscribe(() => {
  saveState(store.getState().store);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
