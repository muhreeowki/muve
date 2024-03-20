import storeReducer from "./slices";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    store: storeReducer,
  },
});
