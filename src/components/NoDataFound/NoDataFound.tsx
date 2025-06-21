const NoDataFound = ({text}:{text:string}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-gray-500 text-sm h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75L14.25 14.25M9.75 14.25L14.25 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        />
      </svg>
      <p>{text}</p>
    </div>
  );
};

export default NoDataFound;