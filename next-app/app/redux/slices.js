import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "./localStorage";

const persistedState = loadState();

export const storeSlice = createSlice({
  initialState: persistedState,
  name: "store",
  reducers: {
    login: (state, action) => {
      state.user = { ...action.payload };
    },
    logout: (state) => {
      state.user = null;
    },
    authenticate: (state) => {
      state.isAuthenticated = true;
      console.log("User Authenticated");
    },
    setPlaylist: (state, action) => {
      state.currentPlaylist = { ...action.payload };
    },
    delPlaylist: (state) => {
      state.currentPlaylist = null;
    },
    setPlaylistItems: (state, action) => {
      state.playlistItems = [...action.payload];
    },
    delPlaylistItems: (state) => {
      state.playlistItems = null;
    },
    setPlaylistTransfer: (state, action) => {
      state.convertTo = action.payload.convertTo;
      state.convertFrom = action.payload.convertFrom;
    },
  },
});

export default storeSlice.reducer;
export const {
  login,
  logout,
  setPlaylist,
  setPlaylistItems,
  delPlaylist,
  delPlaylistItems,
  setPlaylistTransfer,
  authenticate,
} = storeSlice.actions;
