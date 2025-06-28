import React from "react";

type Props = {
  size?: number;
  color?: string;
};

function Loadercomp({ size = 48, color = "black" }: Props) {
  return (
      <div
        className={`border-2 border-${color} border-t-transparent rounded-full animate-spin`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      ></div>
  );
}

export default Loadercomp;