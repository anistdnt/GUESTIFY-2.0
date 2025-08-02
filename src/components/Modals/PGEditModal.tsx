import { hideModal } from "@/redux/slices/modalSlice";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type ModalType = {
  setshowModal: (show: boolean) => void;
  modalData?: any;
};

type EditOptionType = {
  title: string;
  path: string;
  svg_d: string;
  class?: string;
};

function PGEditModal({ setshowModal, modalData }: ModalType) {
  const dispatch = useDispatch();
  const router = useRouter();

  const editOptions: EditOptionType[] = [
    {
      title: "Basic Details",
      path: `/pg/edit/basic-details/${modalData?.rowid}`,
      svg_d: "M5 4h14a2 2 0 012 2v2H3V6a2 2 0 012-2zm0 4h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm3 4h4m-4 4h6",
      class: ""
    },
    {
      title: "Room Details",
      path: `/pg/edit/room-details/${modalData?.rowid}`,
      svg_d: "M3 12h18M6 12V7a1 1 0 011-1h10a1 1 0 011 1v5m-1 4h-2a2 2 0 00-2 2v2H9v-2a2 2 0 00-2-2H4v-4h16v4h-3z",
      class: ""
    },
    {
      title: "All Details",
      path: '',
      svg_d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 3h6v4H9V3zM9 12h6M9 16h6",
      class: "pointer-events-none opacity-50"
    },
    {
      title: "Add Rooms",
      path: `/pg/${modalData?.rowid}/add-room`,
      svg_d: "M12 4v16m8-8H4",
      class: ""
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
        <p className="text-gray-500">
          Edit details for{" "}
          <span className="font-semibold">{modalData?.text}</span>
        </p>
        <div className=" grid grid-cols-2 gap-2">
          {editOptions?.map((opt: EditOptionType, ind: number) => (
            <div
              key={ind}
              className={`py-8 px-16 border rounded-md cursor-pointer hover:text-blue-400 hover:border-blue-400 flex flex-col justify-center items-center gap-2 ${opt?.class}`}
              onClick={() => {
                if(opt?.path){
                  router?.push(opt?.path);
                  dispatch(hideModal(false));
                }
                else{
                  toast?.error("This functionality is not yet available")
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={opt?.svg_d}
                />
              </svg>

              <p>{opt?.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PGEditModal;
