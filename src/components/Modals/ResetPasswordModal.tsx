import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setLoading } from "@/redux/slices/loaderSlice";
import { hideModal } from "@/redux/slices/modalSlice";
import { X } from "@phosphor-icons/react/dist/ssr";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type ModalType = {
  setshowModal: (show: boolean) => void;
};

function ResetPasswordModal({ setshowModal }: ModalType) {
  const [emailId, setemailId] = useState<string>("");

  const dispatch = useDispatch();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading({ loading: true }));
    const res: ApiReturn<any> = await api_caller<any>(
      "POST",
      API.USER.FORGET_PASSWORD,
      {
        email: emailId,
      }
    );
    if (res.success) {
      dispatch(hideModal(false));
      dispatch(setLoading({ loading: false }));
      toast.success(res.message || "Reset Link Send Successfully");
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
          <h3 className="text-xl">Reset Password</h3>
          <button
            onClick={() => {
              setshowModal(false);
            }}
          >
            <X size={20} />
          </button>
        </div>
        <hr />
        <form onSubmit={handleEmailSubmit}>
          <label className="block text-gray-700 font-medium mb-2">
            Registered Email
          </label>
          <input
            type="email"
            name="email"
            value={emailId}
            onChange={(e) => {
              setemailId(e.target.value);
            }}
            required
            placeholder="eg : John@gmail.com"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <button
            type="submit"
            className="btn bg-gray-700 text-white px-3 py-2 rounded-lg float-end"
          >
            Send to Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordModal;
