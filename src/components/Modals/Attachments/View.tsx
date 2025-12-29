"use client";

import { useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import EnlistAttractionForm from "@/components/Forms/EnlistAttraction";
import AssignToPG from "./components/AssignToPG";

type ModalType = {
  setshowModal: (show: boolean) => void;
  modalData?: any;
};

export default function ViewAttachments({ setshowModal, modalData }: ModalType) {
  const [activeTab, setActiveTab] = useState<"aggrement" | "attractions">("attractions");

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50"
      onClick={() => setshowModal(false)}
    >
      <div
        className="relative flex flex-col gap-4 bg-white p-6 mx-2 rounded-md shadow-lg min-w-[600px] w-auto max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">
            View Attachments
          </h3>
          <button onClick={() => setshowModal(false)}>
            <X size={22} />
          </button>
        </div>

        <hr />

        {/* Tab Switch */}
        <div className="flex space-x-3 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("attractions")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              activeTab === "attractions"
                ? "border-b-2 border-yellow-700 text-yellow-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Local Attractions
          </button>

          <button
            onClick={() => setActiveTab("aggrement")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              activeTab === "aggrement"
                ? "border-b-2 border-yellow-700 text-yellow-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tenant Aggrement
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto max-h-[65vh] mt-2 pr-1">
          {activeTab === "attractions" && (
            <AssignToPG local_attachments={modalData?.attractions} pg_id={modalData?.rowid}/>
          )}
        </div>
      </div>
    </div>
  );
}
