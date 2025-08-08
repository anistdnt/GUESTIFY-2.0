import React from 'react';

export const SortIcon = ({sortOrder, setSortOrder}) => {

  const toggleSort = () => {
    if (sortOrder === 'asc') setSortOrder('desc');
    else if (sortOrder === 'desc') setSortOrder(null);
    else setSortOrder('asc');
  };

  const baseClass = "h-6 w-6 cursor-pointer transition-colors";

  const activeClass = "stroke-current text-black stroke-[3]"; // bold and orange when active
  const inactiveClass = "stroke-gray-500 hover:text-gray-700 stroke-[1.5]";

  return (
    <div
      className="flex flex-col h-12 px-3 py-1 bg-slate-100 rounded-md select-none items-center"
      onClick={toggleSort}
      role="button"
      aria-label="Toggle sort order"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && toggleSort()}
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
