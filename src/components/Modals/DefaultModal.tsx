"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ResetPasswordModal from "./ResetPasswordModal";
import OwnerInfoModal from "./OwnerInfoModal";
import { hideModal } from "@/redux/slices/modalSlice";
import ConfirmationModal from "./ConfirmationModal";

export default function DefaultModal() {
  const type = useSelector((state: RootState) => state.modal_slice.type);
  const open = useSelector((state: RootState) => state.modal_slice.open);

  //   const [showModal,setshowModal] = useState<boolean>(false);
  const dispatch = useDispatch();

  const setshowModal = (show: boolean) => {
    dispatch(hideModal(show));
  };

  return (
    <div>
      {open && (
        <div>
          {type === "reset" && (
            <ResetPasswordModal setshowModal={setshowModal} />
          )}
          {type === "ownerinfo" && (
            <OwnerInfoModal setshowModal={setshowModal} />
          )}
          {type === "delete" && (
            <ConfirmationModal setshowModal={setshowModal}/>
          )}
        </div>
      )}
    </div>
  );
}
