import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setLoading } from "@/redux/slices/loaderSlice";
import { hideModal } from "@/redux/slices/modalSlice";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type ModalType = {
  setshowModal: (show: boolean) => void;
  modalData?: any;
};

type EditOptionType = {
    title: string;
    path: string;
}

function PGEditModal({ setshowModal, modalData }: ModalType) {
  const dispatch = useDispatch();
  const router = useRouter();

  const editOptions: EditOptionType[] = [
    {
      title: "Basic Details",
      path: `/pg/edit/basic-details/${modalData?.rowid}`,
    },
    {
      title: "Room Details",
      path: `/pg/edit/room-details/${modalData?.rowid}`,
    },
    {
      title: "All Details",
      path: `/pg/edit/${modalData?.rowid}`,
    },
    {
      title: "Add Rooms",
      path: `/pg/new/add-room`,
    },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-10"
      onClick={() => setshowModal(false)}
    >
      <div
        className="relative flex flex-col gap-3 bg-white p-6 mx-2 rounded-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl">Edit Details</h3>
          <button
            onClick={() => {
              setshowModal(false);
            }}
          >
            <X size={20} />
          </button>
        </div>
        <hr />
        <p className="text-gray-500">Edit details for <span className="font-semibold">{modalData?.text}</span></p>
        <div className=" grid grid-cols-2 gap-2">
            {editOptions?.map((opt:EditOptionType,ind:number)=>(
                <div key={ind} className="p-16 border rounded-md cursor-pointer hover:text-blue-400 hover:border-blue-400" onClick={()=>{
                    router?.push(opt?.path);
                    dispatch(hideModal(false));
                }}>
                    {opt?.title}
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}

export default PGEditModal;
