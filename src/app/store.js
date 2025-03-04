import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import imageSlice from "../features/imageSlice";
import albumSlice from "../features/albumSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    image: imageSlice,
    album: albumSlice,
  },
});
