import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading : false,
  loadLabel : ""
};

const loaderSlice = createSlice({
  name: "loader_slice",
  initialState,
  reducers: {
    setLoading: (state, action:{payload:{loading:boolean,label?:string}}) => {
      state.isLoading = action.payload.loading;
    },
  },
});

export const { setLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
