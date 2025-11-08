import { api_caller, ApiReturn } from "@/lib/api_caller";
import { setLoading } from "@/redux/slices/loaderSlice";
import { hideModal, triggerRefetch } from "@/redux/slices/modalSlice";
import { X } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type ModalType = {
  setshowModal: (show: boolean) => void;
  modalData?: any;
};

function GenericConfirmationModal({ setshowModal, modalData }: ModalType) {
  const dispatch = useDispatch();
  const targetEndpoint = modalData?.endpoint || "";
  const httpMethod = modalData?.method || "PUT";

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      dispatch(setLoading({ loading: true }));
      const res: ApiReturn<any> = await api_caller<any>(
        httpMethod,
        targetEndpoint
      );
      if (res.success) {
        dispatch(hideModal(false));
        dispatch(triggerRefetch(true));
        toast.success(res.message || "Action completed successfully");
      } else {
        throw new Error(`${res.message} : ${res.error}`);
      }
    } catch (error) {
      toast.error(`${error.message}`);
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50"
      onClick={() => setshowModal(false)}
    >
      <div
        className="relative flex flex-col gap-3 bg-white p-6 mx-2 rounded-md shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl">{modalData?.caption ?? "Delete Modal"}</h3>
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
          Are you sure you want to <b>{modalData?.placeholder}</b>?
        </p>
        <button
          type="button"
          className="btn bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg cursor-pointer mt-8"
          onClick={handleConfirm}
        >
          {modalData?.btnText ?? "Delete"}
        </button>
      </div>
    </div>
  );
}

export default GenericConfirmationModal;
