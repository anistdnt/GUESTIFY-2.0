import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPhoneVerified: false,
  isEmailVerified: false,
};

const authVerificationSlice = createSlice({
  name: "auth_verification_slice",
  initialState,
  reducers: {
    setPhoneVerified: (state, action: { payload: boolean }) => {
      state.isPhoneVerified = action.payload;
    },
    setEmailVerified: (state, action: { payload: boolean }) => {
      state.isEmailVerified = action.payload;
    },
  },
});

export const { setPhoneVerified, setEmailVerified } = authVerificationSlice.actions;
export default authVerificationSlice.reducer;
