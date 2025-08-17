// lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import loaderReducer from "./slices/loaderSlice";
import modalReducer from "./slices/modalSlice";
import authVerificationReducer from "./slices/authVerifiactionSlice";

export const store = configureStore({
  reducer: {
    user_slice: userReducer,
    loader_slice: loaderReducer,
    modal_slice : modalReducer,
    auth_verification_slice: authVerificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
