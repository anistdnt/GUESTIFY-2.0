import { createSlice } from "@reduxjs/toolkit";

interface ModalShowType {
  type: string;
  modalData?: any;
  open: boolean;
}

const initialState: ModalShowType = {
  type: "",
  modalData: {},
  open: false,
};

const modalSlice = createSlice({
  name: "modal_slice",
  initialState,
  reducers: {
    setModalVisibility: (state, action: { payload: ModalShowType }) => {
      state.type = action.payload.type;
      state.modalData = action.payload.modalData;
      state.open = action.payload.open;
    },
    hideModal: (state, action: { payload: boolean }) => {
      state.type = "";
      state.open = action.payload;
    },
  },
});

export const { setModalVisibility , hideModal} = modalSlice.actions;
export default modalSlice.reducer;
