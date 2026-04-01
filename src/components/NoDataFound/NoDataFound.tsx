import Link from "next/link";
import React from "react";

const NoDataFound = ({
  text,
  redirectBtn = {},
}: {
  text: string;
  redirectBtn?: { text?: string; link?: string };
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12 px-4 animate-slideFadeIn">
      <div className="flex flex-col items-center max-w-md w-full bg-primary-50/30 backdrop-blur-sm border-2 border-dashed border-primary-200 rounded-3xl p-10 text-center">
        {/* Modern Styled Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary-200 blur-2xl opacity-20 rounded-full animate-pulse"></div>
          <div className="relative p-5 bg-white rounded-2xl shadow-sm border border-primary-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
              />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-display font-bold text-primary-800 mb-2">
          {text || "No Data Found"}
        </h3>
        <p className="text-gray-500 font-body text-sm leading-relaxed">
          We couldn't find what you're looking for. Please try adjusting your
          filters or search terms.
        </p>

        {/* Action Button */}
        {redirectBtn?.link && redirectBtn?.text && (
          <Link
            href={redirectBtn.link}
            className="mt-8 px-8 py-3 bg-buttons hover:bg-buttonsHover text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
          >
            {redirectBtn.text}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NoDataFound;

