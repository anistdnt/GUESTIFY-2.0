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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAFAFA] overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-[120px] opacity-60 animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
        {/* Core Loader Animation */}
        <div className="relative flex items-center justify-center w-32 h-32 mb-8 bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.03)] border border-primary-50">
          <Image
            src="/assets/fullpage_loader.gif"
            alt="Loading..."
            width={120}
            height={120}
            className="brightness-150 object-contain"
            unoptimized // important for gifs
            priority
          />
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-display font-semibold text-gray-900 tracking-tight">
            Guestify Protocol
          </h3>
          <div className="flex items-center gap-2 text-sm font-jakarta text-gray-500 font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
            </span>
            Initializing workspace...
          </div>
        </div>
      </div>
    </div>
  )
}
