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
import FilterModal from "./FilterModal";
import OTPModal from "./ReturnModals/OTPModal";
import BookingModal from "./BookingModal";
import ViewModal from "./Booking/ViewModal";
import AcceptandInitiatePaymentModal from "./Booking/Accept_and_initiatePayment";
import RevolkModal from "./Booking/RevolkModal";
import GenericConfirmationModal from "./GenericConfirmationModal";
import PaymentSessionModal from "./PaymentSessionModal";
import SigningInModal from "./SigningInModal";
import RoomImagePrevModal from "./RoomImagePrevModal";

export default function DefaultModal() {
  const type = useSelector((state: RootState) => state.modal_slice.type);
  const open = useSelector((state: RootState) => state.modal_slice.open);
  const modalData = useSelector((state: RootState) => state.modal_slice.modalData) || {};
  const props = useSelector((state: RootState) => state.modal_slice.props) || {};

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
            <OwnerInfoModal setshowModal={setshowModal} modalData={modalData}/>
          )}
          {type === "delete" && (
            <ConfirmationModal setshowModal={setshowModal}/>
          )}
          {type === "genericConfirmation" && (
            <GenericConfirmationModal setshowModal={setshowModal} modalData={modalData}/>
          )}
          {type === "deletePG" && (
            <DeleteModal setshowModal={setshowModal} modalData={modalData}/>
          )}
          {type === "editPGDetails" && (
            <PGEditModal setshowModal={setshowModal} modalData={modalData}/>
          )}
          {type === "filter" && (
            <FilterModal setshowModal={setshowModal}/>
          )}
          {type === "otpVerify" && (
            <OTPModal setshowModal={setshowModal} modalData={modalData} {...props}/>
          )}
          {type === "roombooking" && (
            <BookingModal setshowModal={setshowModal} modalData={modalData} />
          )}
          {type === "viewbooking" && (
            <ViewModal setshowModal={setshowModal} modalData={modalData} />
          )}
          {type === "accept_and_initiatePayment" && (
            <AcceptandInitiatePaymentModal setshowModal={setshowModal} modalData={modalData}/>
          )}
          {type === "revolke_booking" && (
            <RevolkModal setshowModal={setshowModal} modalData={modalData}/>
          )}
          {type === "paymentSession" && (
            <PaymentSessionModal setshowModal={setshowModal} modalData={modalData}/>
          )}
          {type === "signingin" && (
            <SigningInModal setshowModal={setshowModal}/>
          )}
          { type === "roomimageprev" && (
            <RoomImagePrevModal setshowModal={setshowModal} modalData={modalData} />
          )}
        </div>
      )}
    </div>
  );
}
