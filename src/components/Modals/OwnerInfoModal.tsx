"use client";
import {
  AddressBook,
  EnvelopeSimple,
  Phone,
  SealCheck,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import Image from "next/image";
import Link from "next/link";

type ModalType = {
  setshowModal: (show: boolean) => void;
  modalData?: any;
};

function OwnerInfoModal({ setshowModal, modalData }: ModalType) {
  const [ownerInfo, setOwnerInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      try {
        setLoading(true);
        const res: ApiReturn<any> = await api_caller<any>(
          "GET",
          `${API.OWNER.GET_OWNER_BY_ID}/${modalData?.rowid}`
        );
        if (res?.success) {
          setOwnerInfo(res.data);
        } else {
          setError("Failed to load owner information.");
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (modalData?.rowid) {
      fetchOwnerInfo();
    }
  }, [modalData?.rowid]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-10"
      onClick={() => setshowModal(false)}
    >
      <div
        className="relative flex flex-col gap-5 bg-white p-6 mx-2 rounded-md shadow-lg min-w-[500px] w-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl">Owner Information</h3>
          <button onClick={() => setshowModal(false)}>
            <X size={20} />
          </button>
        </div>
        <hr />

        {/* Loader Skeleton */}
        {loading && (
          <OwnerInfoSkeleton/>
        )}

        {/* Error */}
        {error && !loading && (
          <p className="text-red-600 text-center py-4">{error}</p>
        )}

        {/* Owner Info */}
        {!loading && ownerInfo && (
          <div>
            <div className="flex flex-col sm:flex-row justify-start items-center gap-10">
              <div className="size-[150px] rounded-full overflow-hidden border flex-shrink-0">
                <Image
                  src={ownerInfo?.image_url || "/assets/profile.png"}
                  alt="owner_image"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 text-wrap">
                <p className="text-2xl mb-2 font-semibold">
                  <span className="text-sm font-normal">Owner </span>
                  {ownerInfo?.owner_name || "John Doe"}
                </p>

                {/* Email */}
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <EnvelopeSimple size={20} weight="bold" />
                  <Link
                    href={`mailto:${ownerInfo?.email}`}
                    className="hover:underline"
                  >
                    {ownerInfo?.email}
                  </Link>
                  {ownerInfo?.is_email_verified && (
                    <span data-tooltip="Verified"><SealCheck size={20} color="#0eaf19" weight="fill"/></span>
                  )}
                  {ownerInfo?.preferred_contact === "email" && <span data-tooltip="Preffered Contact Medium"><AddressBook size={20} color="#0eaf19" weight="bold" /></span>}
                </p>

                {/* Phone */}
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Phone size={20} weight="bold" />
                  <Link
                    href={`tel:${ownerInfo?.country_code}${ownerInfo?.phone_number}`}
                    className="hover:underline"
                  >
                    {ownerInfo?.country_code} {ownerInfo?.phone_number}
                  </Link>
                  {ownerInfo?.is_phone_verified && (
                    <span data-tooltip="Verified"><SealCheck size={20} color="#0eaf19" weight="fill"/></span>
                  )}
                  {ownerInfo?.preferred_contact === "phone" && <span data-tooltip="Preffered Contact Medium"><AddressBook size={20} color="#0eaf19" weight="bold" /></span>}
                </p>

                {/* ALternate Number  */}
                {ownerInfo?.alt_country_code !== "" &&
                  ownerInfo?.alt_phone_number !== "" && (
                    <div>
                      <div className="flex items-center gap-4 my-1">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="text-gray-500 text-sm font-medium">
                          OR
                        </span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                      </div>
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <Phone size={20} weight="bold" />
                        <Link
                          href={`tel:${ownerInfo?.alt_country_code}${ownerInfo?.alt_phone_number}`}
                          className="hover:underline"
                        >
                          {ownerInfo?.alt_country_code}{" "}
                          {ownerInfo?.alt_phone_number}
                        </Link>
                        {ownerInfo?.is_phone_verified && (
                          <span data-tooltip="Verified"><SealCheck size={20} color="#0eaf19" weight="fill"/></span>
                        )}
                      </p>
                    </div>
                  )}

                {/* WhatsApp */}
                {ownerInfo?.whatsapp_number && (
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <WhatsappLogo size={20} weight="bold" />
                    <Link
                      href={`https://wa.me/${ownerInfo?.whatsapp_code}${ownerInfo?.whatsapp_number}`}
                      target="_blank"
                      className="hover:underline"
                    >
                      {ownerInfo?.whatsapp_code} {ownerInfo?.whatsapp_number}
                    </Link>
                    {ownerInfo?.preferred_contact === "whatsapp" && <span data-tooltip="Preffered Contact Medium"><AddressBook size={20} color="#0eaf19" weight="bold" /></span>}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end items-center gap-4">
              <Link
                href={`mailto:${ownerInfo?.email}`}
                className=" bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md"
              >
                Send an Email
              </Link>
              <Link
                href={`tel:${ownerInfo?.country_code}${ownerInfo?.phone_number}`}
                className=" bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md"
              >
                Call Owner
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const OwnerInfoSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col sm:flex-row justify-start items-center gap-10">
        {/* Avatar */}
        <div className="size-[150px] rounded-full overflow-hidden border flex-shrink-0 bg-gray-300" />

        {/* Details */}
        <div className="flex flex-col gap-3 w-full max-w-md">
          {/* Owner name */}
          <div className="h-6 w-40 bg-gray-300 rounded"></div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-52 bg-gray-300 rounded"></div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-40 bg-gray-300 rounded"></div>
          </div>

          {/* Alt Phone */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-36 bg-gray-300 rounded"></div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end items-center gap-4">
        <div className="h-9 w-28 bg-gray-300 rounded-md"></div>
        <div className="h-9 w-28 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
};

export default OwnerInfoModal;
