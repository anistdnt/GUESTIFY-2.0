"use client";

import React from "react";
import Link from "next/link";

interface CommonButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  animate?: boolean;
  disabled?: boolean;
}

const CommonButton = ({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  iconPosition = "right",
  animate = true,
  disabled = false,
}: CommonButtonProps) => {
  const baseStyles = "relative inline-flex items-center justify-center font-bold transition-all duration-300 overflow-hidden";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-primary-600/30",
    secondary: "bg-white text-primary-600 border-2 border-primary-100 hover:border-primary-600 hover:bg-primary-50",
    outline: "border-2 border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50",
    ghost: "text-gray-600 hover:text-primary-600 hover:bg-primary-50",
    dark: "bg-gray-900 text-white hover:bg-gray-800 shadow-xl hover:shadow-gray-900/40",
  };

  const sizes = {
    sm: "px-5 py-2.5 rounded-xl text-sm",
    md: "px-8 py-4 rounded-2xl text-base",
    lg: "px-10 py-5 rounded-2xl text-lg",
    xl: "px-12 py-6 rounded-[1.5rem] text-xl",
  };

  const animationClasses = animate ? "transform hover:-translate-y-1 active:scale-95 active:translate-y-0" : "";

  const ButtonContent = () => (
    <>
      {/* Subtle shine effect on hover */}
      <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></span>
      
      <div className="flex items-center gap-2 relative z-10">
        {icon && iconPosition === "left" && <span className="transition-transform duration-300 group-hover:-translate-x-1">{icon}</span>}
        <span className="font-display">{children}</span>
        {icon && iconPosition === "right" && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
      </div>
    </>
  );

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${animationClasses} ${className} group`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} disabled={disabled}>
      <ButtonContent />
    </button>
  );
};

export default CommonButton;
