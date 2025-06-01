// lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import loaderReducer from "./slices/loaderSlice";

export const store = configureStore({
  reducer: {
    user_slice: userReducer,
    loader_slice: loaderReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
