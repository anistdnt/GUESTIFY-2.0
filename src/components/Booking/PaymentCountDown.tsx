"use client";

import { Info } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState, useRef } from "react";

interface PaymentCountdownProps {
  ttl: number; // seconds
}

export default function PaymentCountdown({ ttl }: PaymentCountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState(ttl);
  const endTimeRef = useRef<number>(0);

  useEffect(() => {
    // Calculate end time only once
    endTimeRef.current = Date.now() + ttl * 1000;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((endTimeRef.current - Date.now()) / 1000)
      );

      setSecondsLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ttl]);

  const format = (secs: number) => {
    const days = Math.floor(secs / (24 * 3600));
    const hours = Math.floor((secs % (24 * 3600)) / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <span className="flex items-center">
      <Info size={16} className="inline mr-1" weight="fill" color={secondsLeft > 0 ? '#a16207' : '#de0d0d'} />
      <span className={secondsLeft > 0 ? "text-yellow-700" : "text-red-600"}>
        {secondsLeft > 0
          ? `Payment expires in : ${format(secondsLeft)}`
          : "Payment Expired"}
      </span>
    </span>
  );
}
