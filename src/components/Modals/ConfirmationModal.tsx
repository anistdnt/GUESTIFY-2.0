import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setLoading } from "@/redux/slices/loaderSlice";
import { hideModal } from "@/redux/slices/modalSlice";
import { setUserData } from "@/redux/slices/userSlice";
import { X } from "@phosphor-icons/react/dist/ssr";
import { deleteCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type ModalType = {
  setshowModal: (show: boolean) => void;
};

function ConfirmationModal({ setshowModal }: ModalType) {
  const [deleteText, setdeleteText] = useState<string>("");

  const dispatch = useDispatch();
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (deleteText === "DELETE") {
      dispatch(setLoading({ loading: true }));
      const res: ApiReturn<any> = await api_caller<any>(
        "DELETE",
        API.USER.DELETE_ACCOUNT,
        {
          confirm_prompt: "Delete Account",
        }
      );
      if (res.success) {
        deleteCookie("authToken");
        dispatch(setUserData({}));
        dispatch(hideModal(false));
        dispatch(setLoading({ loading: false }));
        router.push("/");
        toast.success(res.message || "Reset Link Send Successfully");
      } else {
        dispatch(setLoading({ loading: false }));
        toast.error(`${res.message} : ${res.error}`);
      }
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
          <h3 className="text-xl">Delete Account</h3>
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
          Are you sure you want to delete the account? This will permanently
          delete the credentials from the database
        </p>
        <form onSubmit={handleEmailSubmit}>
          <label className="block text-gray-700 font-medium mb-2">
            Enter "DELETE" in the textbox to confirm.
          </label>
          <input
            type="text"
            name="delete_text"
            value={deleteText}
            onChange={(e) => {
              setdeleteText(e.target.value);
            }}
            required
            placeholder="eg : DELETE"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <button
            type="submit"
            className={`btn bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg float-end ${
              deleteText !== "DELETE" ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={deleteText !== "DELETE"}
          >
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConfirmationModal;
