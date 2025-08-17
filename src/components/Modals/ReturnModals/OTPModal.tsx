import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/slices/loaderSlice";
import { hideModal } from "@/redux/slices/modalSlice";
import { X } from "@phosphor-icons/react/dist/ssr";
import toast from "react-hot-toast";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { setEmailVerified, setPhoneVerified } from "@/redux/slices/authVerifiactionSlice";

type OTPModalProps = {
  setshowModal: (show: boolean) => void;
  modalData?: any;
};

function OTPModal({
  setshowModal,
  modalData = {}
}: OTPModalProps) {
  const { timerDuration = 60, validationType="phone" } = modalData;
  const dispatch = useDispatch();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);

  useEffect(() => {
    setTimeLeft(timerDuration);
  }, [timerDuration]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    let payload: any = {};
    let url:string = "";
    if(validationType === "phone") {
      url = `${API.VERIFICATION.VERIFY_PHONE_OTP}`;
      payload = {
        phoneNumber: modalData.phoneNumber || "",
        code: otpValue,
      };
    }
    else if(validationType === "email") {
      url = `${API.VERIFICATION.VERIFY_EMAIL_OTP}`;
      payload = {
        email: modalData.email || "",
        code: otpValue,
      };
    }

    dispatch(setLoading({ loading: true }));

    const result: ApiReturn<any> = await api_caller<any>("POST", url, payload);

    if (result.success) {
      dispatch(hideModal(false));
      dispatch(setLoading({ loading: false }));
      if (validationType === "phone") {
        dispatch(setPhoneVerified(true));
      } else if (validationType === "email") {
        dispatch(setEmailVerified(true));
      }
      toast.success(result?.message || "OTP verified successfully!");
    }
    else{
      dispatch(setLoading({ loading: false }));
      toast.error(result?.message || "Failed to verify OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    dispatch(setLoading({ loading: true }));
    try {
      let payload: any = {};
      if (validationType === "phone") {
        payload = {
          phoneNumber: modalData.phoneNumber || "",
        };
      } else if (validationType === "email") {
        payload = {
          email: modalData.email || "",
          owner_name: modalData.owner_name || "",
        };
      }

      const result: ApiReturn<any> = await api_caller<any>("POST",`${API.VERIFICATION.SEND_PHONE_OTP}`,payload);

      if (result.success) {
        setOtp(Array(6).fill(""));
        setTimeLeft(timerDuration);
        inputRefs.current[0]?.focus();
        toast.success(result.message || "OTP Resend successfully!");
      }
      else {
        toast.error(result?.message || "Failed to resend OTP. Please try again.");
      }
    } finally {
      dispatch(setLoading({ loading: false }));
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
          <h3 className="text-xl">Enter OTP</h3>
          <button onClick={() => setshowModal(false)}>
            <X size={20} />
          </button>
        </div>
        <hr />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                className="w-10 h-12 text-center text-lg border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>

          {timeLeft > 0 ? (
            <p className="text-center text-sm text-gray-500">
              Resend OTP in {timeLeft}s
            </p>
          ) : (
            <button
              type="button"
              className="text-sm"
            >
              <span className=" text-gray-400">Haven't Receive OTP? </span><span className="text-blue-400" onClick={handleResend}>Resend</span>
            </button>
          )}

          <button
            type="submit"
            className="btn bg-buttons hover:bg-buttonsHover text-white px-3 py-2 rounded-lg"
          >
            Verify OTP
          </button>
        </form>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default OTPModal;
