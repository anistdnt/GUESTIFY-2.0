// export default function loading() {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
//       <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//     </div>
//   )
// }

import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <Image
        src="/assets/fullpage_loader.gif"
        alt="Loading..."
        width={200}
        height={200}
        className="brightness-150"
        unoptimized // important for gifs
      />
      <p className="mt-2 text-lg font-medium text-gray-700 animate-pulse">
        Loading...
      </p>
    </div>
  )
}
