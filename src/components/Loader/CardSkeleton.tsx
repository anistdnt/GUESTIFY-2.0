export const CardSkeleton = ({ no_of_card }: { no_of_card: number }) => {
  return (
    <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 pt-8 pb-10 px-3 justify-items-center">
      {Array.from({ length: no_of_card }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 animate-pulse w-full"
        >
          <div className="relative">
            <div className="w-full h-60 bg-gray-300" />
            <span className="absolute top-2 right-2 bg-gray-400 text-transparent text-xs px-2 py-1 rounded">
              Girls
            </span>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="h-5 bg-gray-300 rounded w-40 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-64" />
              </div>
              <div className="text-right">
                <div className="h-5 bg-gray-300 rounded w-20 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-3 mb-2 text-xs">
              <div className="bg-gray-200 rounded px-2 py-1 w-24 h-4" />
              <div className="bg-gray-200 rounded px-2 py-1 w-28 h-4" />
              <div className="bg-gray-200 rounded px-2 py-1 w-20 h-4" />
            </div>

            <hr />

            <div className="flex flex-row">
              <div className="flex flex-col p-2">
                <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                <div className="h-3 bg-gray-300 rounded w-16" />
              </div>
              <div className="flex flex-col border-l p-2">
                <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                <div className="h-3 bg-gray-300 rounded w-16" />
              </div>
            </div>

            <hr />

            <div className="mt-2 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>

            <div className="flex flex-row justify-between items-center mt-4">
              <div className="h-4 bg-gray-300 rounded w-48" />
              <div className="flex gap-4">
                <div className="h-8 w-24 bg-gray-400 rounded" />
                <div className="h-8 w-28 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};