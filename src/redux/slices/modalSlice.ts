import { createSlice } from "@reduxjs/toolkit";

interface ModalShowType {
  type: string;
  modalData?: any;
  props?: any;
  open: boolean;
  isDeleted?: boolean;
  isRefetch?: boolean;
}

const initialState: ModalShowType = {
  type: "",
  modalData: {},
  props: {},
  open: false,
  isDeleted: false,
  isRefetch: false,
};

const modalSlice = createSlice({
  name: "modal_slice",
  initialState,
  reducers: {
    setModalVisibility: (state, action: { payload: ModalShowType }) => {
      state.type = action.payload.type;
      state.modalData = action.payload.modalData;
      state.open = action.payload.open;
      state.props = action.payload.props || {};
    },
    hideModal: (state, action: { payload: boolean }) => {
      state.type = "";
      state.open = action.payload;
    },
    deleteSuccess: (state, action: { payload: boolean }) => {
      state.isDeleted = action.payload;
    },
    triggerRefetch: (state, action: { payload: boolean }) => {
      state.isRefetch = action.payload;
    }
  },
});

export const { setModalVisibility , hideModal, deleteSuccess, triggerRefetch } = modalSlice.actions;
export default modalSlice.reducer;
