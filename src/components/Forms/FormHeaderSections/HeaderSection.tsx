import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

export default function HeaderSection() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-white py-10 px-6 rounded-lg">
      <div className="max-w-7xl mx-auto flex items-center space-x-6">
        {/* Illustration / Icon */}
        <div className="w-44 h-36 relative">
          <Image
            src="/assets/sample1.jpg"
            alt="PG Illustration"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
            priority
          />
        </div>

        {/* Text Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Enlist Your Paying Guest Accommodation
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Provide complete and accurate details about your PG property to 
            ensure better visibility and attract the right tenants. 
            Please review our <span className="text-buttons font-medium">Terms & Services</span>{" "} 
            before continuing.
          </p>

          {/* Button */}
          <button className="mt-4 px-5 py-2 rounded-lg bg-buttons text-white font-medium hover:bg-buttonsHover transition flex items-center justify-center gap-2">
            <span>Read Terms & Services</span>
            <ArrowSquareOut size={20} color="#ffffff" />
          </button>
        </div>
      </div>
    </div>
  )
}
