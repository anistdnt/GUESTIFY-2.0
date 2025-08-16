import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/slices/loaderSlice";
import { hideModal } from "@/redux/slices/modalSlice";
import { X } from "@phosphor-icons/react/dist/ssr";
import toast from "react-hot-toast";

type OTPModalProps = {
  setshowModal: (show: boolean) => void;
  timerDuration?: number; // seconds
  onSubmitOTP: (otp: string) => Promise<boolean>; // returns OTP to parent
  onResend?: () => Promise<void>;
};

function OTPModal({
  setshowModal,
  timerDuration = 60,
  onSubmitOTP,
  onResend,
}: OTPModalProps) {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [timeLeft, setTimeLeft] = useState(timerDuration);

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
    dispatch(setLoading({ loading: true }));
    try {
      const res = await onSubmitOTP(otpValue);
      if(res){
        toast.success("OTP verified successfully!");
      }
      else {
        toast.error("Invalid OTP. Please try again.");
     }
      dispatch(hideModal(false));
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  const handleResend = async () => {
    if (!onResend) return;
    dispatch(setLoading({ loading: true }));
    try {
      await onResend();
      setOtp(Array(6).fill(""));
      setTimeLeft(timerDuration);
      inputRefs.current[0]?.focus();
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
              onClick={handleResend}
              className="text-blue-500 underline text-sm"
            >
              Resend OTP
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
