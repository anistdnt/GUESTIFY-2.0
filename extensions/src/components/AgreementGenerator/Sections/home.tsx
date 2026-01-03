"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  ClockCounterClockwiseIcon,
  NoteIcon,
  PlusCircleIcon,
  RobotIcon,
  StopCircleIcon,
  SwapIcon,
  XIcon,
} from "@phosphor-icons/react";
import AgreementModal from "./AgreementModal";
import { AgreementSchema } from "@/utils/Generator/form.validation";

type AgreementFormValues = typeof AgreementSchema.initialValues;

type Props = {
  name: string;
  email: string;
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  isStreaming: boolean;
  handleGenerate: (payload?: any) => Promise<void>;
  promptHistory: string[];
  stopGeneration: () => void;
};

export default function HomeSection({
  email,
  handleGenerate,
  isStreaming,
  name,
  prompt,
  setPrompt,
  promptHistory,
  stopGeneration,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [agreementPayload, setAgreementPayload] = useState<any>({});

  const handleModalSubmit = (values: AgreementFormValues) => {
    const payload = {
      ...values,
    };
    setAgreementPayload(payload);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="my-4">
        <h4 className="text-lg font-medium text-gray-500 mb-1">Welcome,</h4>
        <h2 className="text-4xl font-medium text-gray-800">
          {name || "John Doe"}
        </h2>
        <p className="text-sm font-medium text-gray-500">
          {email || "john@gmail.com"}
        </p>
      </div>

      {/* Attched Payload for Agreement Generation: (Make a Note type secion)*/}
      {Object.keys(agreementPayload).length > 0 && (
        <div className="my-2 p-2 bg-gray-100 rounded">
          <div className="bg-white p-3 rounded text-sm text-gray-800 overflow-x-auto flex items-center gap-3 relative">
            {/* Icon */}
            <NoteIcon size={45} className="w-2/6 text-gray-600" />

            {/* Summary */}
            <div className="text-sm w-4/6">
              {`Owner: ${agreementPayload.owner_name}, Tenant: ${agreementPayload.tenant_name}, PG: ${agreementPayload.pg_name}, Rent: ₹${agreementPayload.rent}`.substring(
                0,
                100
              )}
              ...
            </div>

            {/* Close Button */}
            <button
              onClick={() => setAgreementPayload({})}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 text-sm hover:bg-red-600"
              title="Remove agreement"
            >
              <XIcon size={10} weight="bold" />
            </button>
          </div>
        </div>
      )}

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isStreaming}
        placeholder="Add custom instructions..."
        className="w-full h-28 border rounded p-3 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
      />

      <div className="flex gap-2">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setIsModalOpen(true)}
          disabled={isStreaming || Object.keys(agreementPayload).length > 0}
        >
          <PlusCircleIcon size={26} />
        </button>
        <button
          onClick={() => handleGenerate(agreementPayload)}
          disabled={isStreaming || Object.keys(agreementPayload).length === 0}
          className="flex-1 flex flex-row items-center justify-center gap-2 bg-gray-700 text-white py-2 rounded disabled:opacity-50"
        >
          {isStreaming ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          ) : (
            <RobotIcon size={22} />
          )}
          {isStreaming ? "Generating..." : "Generate"}
        </button>
        {isStreaming && (
          <button
            onClick={stopGeneration}
            className=" bg-red-600 text-white py-2 rounded hover:bg-red-700 px-2"
          >
            <StopCircleIcon size={22} weight="bold" />
          </button>
        )}
      </div>

      {/* Prompt History */}
      <div className="mt-4 flex-1 flex flex-col">
        <h3 className="flex flex-row justify-start items-center gap-2 text-sm font-medium mb-3 text-gray-700">
          <ClockCounterClockwiseIcon size={22} weight="fill" />
          <span>Prompt History</span>
        </h3>
        <ul className="text-sm text-gray-600 space-y-2 overflow-y-scroll h-full">
          {promptHistory.map((p, i) => (
            <li
              key={i}
              className="cursor-pointer p-2 bg-zinc-50 rounded break-words flex justify-between items-center"
            >
              <span>{p}</span>
              <span onClick={() => setPrompt(p)} className="cursor-pointer">
                <SwapIcon size={20} weight="fill" />
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AgreementModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
