"use client";
import { SpinnerGap } from "@phosphor-icons/react/dist/ssr";
import React from "react";

type Props = {
  setshowModal: (show: boolean) => void;
};

export default function SigningInModal({}: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white min-w-[350px] rounded-xl shadow-lg p-6 relative">
        {/* Content */}
        <div className="flex flex-col items-center justify-center min-h-[180px] gap-4">
          <SpinnerGap size={50} className="animate-spin text-green-700" />
          <p className="text-gray-600 font-medium">
            Signing in...
          </p>
        </div>
      </div>
    </div>
  );
}
