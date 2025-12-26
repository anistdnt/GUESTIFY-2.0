"use client";

type FullPageErrorProps = {
  title?: string;
  message: string;
};

export const FullPageError = ({
  title = "Something went wrong",
  message,
}: FullPageErrorProps) => {
  const handleClose = () => {
    window.close();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-neutral-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-red-100 text-center">
        {/* SVG Illustration */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 4h.01M10.29 3.86l-8.02 14A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.23-2.14l-8.02-14a1.5 1.5 0 00-2.42 0z"
            />
          </svg>
        </div>

        {/* Text */}
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          {title}
        </h2>

        <p className="mb-6 text-sm text-gray-600">
          {message}
        </p>

        {/* Action */}
        <button
          onClick={handleClose}
          className="inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Close this tab
        </button>

        {/* Fallback hint */}
        <p className="mt-4 text-xs text-gray-400">
          If the tab doesn’t close automatically, you can safely close it manually.
        </p>
      </div>
    </div>
  );
};
