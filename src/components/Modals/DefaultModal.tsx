"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ResetPasswordModal from "./ResetPasswordModal";
import OwnerInfoModal from "./OwnerInfoModal";
import { hideModal } from "@/redux/slices/modalSlice";
import ConfirmationModal from "./ConfirmationModal";
import DeleteModal from "./DeleteModal";
import PGEditModal from "./PGEditModal";

export default function DefaultModal() {
  const type = useSelector((state: RootState) => state.modal_slice.type);
  const open = useSelector((state: RootState) => state.modal_slice.open);
  const modalData = useSelector((state: RootState) => state.modal_slice.modalData) || {};

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
          {type === "deletePG" && (
            <DeleteModal setshowModal={setshowModal} modalData={modalData}/>
          )}
          {type === "editPGDetails" && (
            <PGEditModal setshowModal={setshowModal} modalData={modalData}/>
          )}
        </div>
      )}
    </div>
  );
}
