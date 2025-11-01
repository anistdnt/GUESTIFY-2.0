"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 px-6">
      {/* Optional Logo */}
      <div className="mb-4">
        <Image
          src="/assets/logo-bg-removed.png"
          alt="Guestify Logo"
          width={130}
          height={50}
          loading="eager"
        />
      </div>

      <h1 className="text-[8rem] font-extrabold text-gray-300 leading-none select-none">
        404
      </h1>

      <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>

      <p className="text-gray-500 max-w-md text-center mb-6">
        The page you are trying to access doesn’t exist or has been moved.  
        Please check the URL or return to the dashboard.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition text-gray-800"
        >
          <ArrowLeft size={22}/>
          Go Back
        </button>

        <Link
          href="/admin/dashboard"
          className="px-5 py-2 rounded-xl bg-[#212121] text-white hover:bg-[#333] transition"
        >
          Go to Dashboard
        </Link>
      </div>

      <div className="absolute bottom-6 text-xs text-gray-500">
        © {new Date().getFullYear()} Guestify Admin
      </div>
    </div>
  );
}
