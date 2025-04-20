import { ProfileType } from "@/types/profile_type";
import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next/client";

const initialState = {
  token: "",
  decodedToken : {
  },
  userData: {} as ProfileType,
};

const userSlice = createSlice({
  name: "user_slice",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setToken: (state, action) => {
      state.token = getCookie(action.payload) as string;
    },
  },
});

export const { setUserData, setToken } = userSlice.actions;
export default userSlice.reducer;
