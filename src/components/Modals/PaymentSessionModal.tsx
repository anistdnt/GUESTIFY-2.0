"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, SpinnerGap, X } from "@phosphor-icons/react";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { useRouter } from "next/navigation";

type Props = {
  setshowModal: (show: boolean) => void;
  modalData: {
    booking_id: string;
  };
};

export default function PaymentSessionStatusModal({
  setshowModal,
  modalData,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res: ApiReturn<any> = await api_caller(
          "GET",
          `booking/${modalData.booking_id}/payment/active-session`
        );

        if (res?.success) {
          setActive(true);
          setMessage("Payment session is active");
          router?.push(res.data.session_url);
          // window.open(res.data.session_url, "_blank", "noopener,noreferrer");
        } else {
          setActive(false);
          setMessage(res?.message || "No active session found");
        }
      } catch (err) {
        setActive(false);
        setMessage("Unable to check session");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [modalData.booking_id]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <div
        className="bg-white min-w-[350px] rounded-xl shadow-lg p-6 relative"
      >

        {/* Content */}
        <div className="flex flex-col items-center justify-center min-h-[180px] gap-4">

          {loading && (
            <>
              <SpinnerGap
                size={50}
                className="animate-spin text-yellow-600"
              />
              <p className="text-gray-600 font-medium">
                Checking payment session...
              </p>
            </>
          )}

          {!loading && active === true && (
            <>
              <CheckCircle size={60} className="text-green-500" />
              <p className="text-green-600 text-lg font-semibold">
                {message}
              </p>
            </>
          )}

          {!loading && active === false && (
            <>
              <XCircle size={60} className="text-red-500" />
              <p className="text-red-600 text-lg font-semibold">
                {message}
              </p>
              <button onClick={() => setshowModal(false)} className="bg-yellow-800 text-white px-2 py-2 rounded-md w-full">Close Payment</button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
