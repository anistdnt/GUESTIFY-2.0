import React from 'react';

export const SortIcon = ({sortOrder, setSortOrder}) => {

  const toggleSort = () => {
    if (sortOrder === 'asc') setSortOrder('desc');
    else if (sortOrder === 'desc') setSortOrder(null);
    else setSortOrder('asc');
  };

  const baseClass = "h-5 w-5 cursor-pointer transition-all duration-300";
  const activeClass = "stroke-current text-primary-600 stroke-[3]";
  const inactiveClass = "stroke-gray-300 hover:text-gray-400 stroke-[2]";

  return (
    <div
      className="flex flex-col h-12 w-12 bg-gray-50 hover:bg-white border border-gray-100 hover:border-primary-100 rounded-full select-none items-center justify-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md group"
      onClick={toggleSort}
      role="button"
      aria-label="Toggle sort order"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && toggleSort()}
      data-tooltip="Toggle Sort Order"
    >
      {/* Up arrow */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${baseClass} ${sortOrder === 'asc' ? activeClass : inactiveClass}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={sortOrder === 'asc' ? 3 : 1.5}
          d="M6 15l6-6 6 6" 
        />
      </svg>

      {/* Down arrow */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${baseClass} ${sortOrder === 'desc' ? activeClass : inactiveClass}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={sortOrder === 'desc' ? 3 : 1.5}
          d="M6 9l6 6 6-6" 
        />
      </svg>
    </div>
  );
};
