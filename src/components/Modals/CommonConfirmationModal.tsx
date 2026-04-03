"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Warning, Trash, Info, CheckCircle, X } from "@phosphor-icons/react";

interface CommonConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export default function CommonConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: CommonConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setInternalLoading(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
    } catch (error) {
      console.error("Confirmation error:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const loading = isLoading || internalLoading;

  const variantStyles = {
    danger: {
      icon: <Trash weight="bold" size={20} className="text-red-600" />,
      bg: "bg-red-50",
      btn: "bg-red-600 hover:bg-red-700 shadow-md shadow-red-100",
      title: "text-red-900"
    },
    warning: {
      icon: <Warning weight="bold" size={20} className="text-amber-600" />,
      bg: "bg-amber-50",
      btn: "bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-100",
      title: "text-amber-900"
    },
    success: {
      icon: <CheckCircle weight="bold" size={20} className="text-green-600" />,
      bg: "bg-green-50",
      btn: "bg-green-600 hover:bg-green-700 shadow-md shadow-green-100",
      title: "text-green-900"
    },
    info: {
      icon: <Info weight="bold" size={20} className="text-blue-600" />,
      bg: "bg-blue-50",
      btn: "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100",
      title: "text-blue-900"
    },
  };

  const style = variantStyles[variant];

  // Using Portal to render at body root for full screen overlay
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity cursor-pointer"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Close Button */}
          {!loading && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
            >
              <X size={16} weight="bold" />
            </button>
          )}

          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-2xl ${style.bg} shrink-0`}>
              {style.icon}
            </div>
            <div className="space-y-1 pr-6 text-left">
              <h3 className={`text-lg font-bold font-jakarta leading-tight ${style.title}`}>
                {title}
              </h3>
              <p className="text-gray-500 font-jakarta text-sm leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gray-50 text-gray-600 font-bold text-xs tracking-widest uppercase hover:bg-gray-100 transition-all font-jakarta active:scale-[0.98] disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-[1.5] py-3 rounded-xl text-white font-bold text-xs tracking-widest uppercase transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${style.btn}`}
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Wait...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
