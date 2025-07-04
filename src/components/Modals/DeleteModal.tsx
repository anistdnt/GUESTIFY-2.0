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

function DeleteModal({ setshowModal, modalData }: ModalType) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setLoading({ loading: true }));
    const res: ApiReturn<any> = await api_caller<any>(
      "DELETE",
      `${API.PG.DELETE}/${modalData?.rowid}`
    );
    if (res.success) {
      dispatch(hideModal(false));
      dispatch(setLoading({ loading: false }));
    //   router.push("/");
      toast.success(res.message || "PG Deleted Successfully");
    } else {
      dispatch(setLoading({ loading: false }));
      toast.error(`${res.message} : ${res.error}`);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-10"
      onClick={() => setshowModal(false)}
    >
      <div
        className="relative flex flex-col gap-3 bg-white p-6 mx-2 rounded-md shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl">Delete Paying Guest</h3>
          <button
            onClick={() => {
              setshowModal(false);
            }}
          >
            <X size={20} />
          </button>
        </div>
        <hr />
        <p className="text-yellow-600 text-sm">
          Are you sure you want to delete the Paying Guest House <b>{modalData?.text}</b>?
        </p>
        <div className="text-yellow-600 text-sm">
            <span>This will permanently delete the following credentials from the database</span>
            <ul>
                <li>All Rooms</li>
            </ul>
        </div>
        <button
          type="button"
          className="btn bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg cursor-pointer mt-8"
          onClick={handleDelete}
        >
          Delete Paying Guest
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
