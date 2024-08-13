import storeReducer from "@/redux/slices";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    store: storeReducer,
  },
});
