export const CollegeListSkeleton = () => {
  return (
    <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
      {Array.from({ length: 5 }).map((_, index) => (
        <li key={index}>
          <div className="flex items-center py-2 pl-2 rounded animate-pulse">
            <div className="w-10 h-10 mr-2 bg-gray-300 rounded-md" />
            <div className="ml-2 space-y-1">
              <div className="h-4 w-40 bg-gray-300 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};