"use client";

import { Info } from "@phosphor-icons/react/dist/ssr";
import React from "react";

type TooltipProps = {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
};

export default function Tooltip({ text, position = "top" }: TooltipProps) {
  return (
    <div
      className="relative flex items-center"
      data-tooltip={text}
      data-tooltip-pos={position}
    >
      <Info
        size={18}
        weight="fill"
        className="text-gray-500 cursor-pointer hover:text-gray-800"
      />
    </div>
  );
}
