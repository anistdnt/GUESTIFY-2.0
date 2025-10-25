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
    setWishlistData: (state, action) => {
      state.userData.wishlist = [...state?.userData?.wishlist, action.payload];
    },
    removeWishlistData:(state, action) => {
      state.userData.wishlist = state?.userData?.wishlist?.filter((i) => i !== action.payload);
    },
    setToken: (state, action) => {
      state.token = getCookie(action.payload) as string;
    },
  },
});

export const { setUserData, setWishlistData, removeWishlistData, setToken } = userSlice.actions;
export default userSlice.reducer;
