import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

export default function HeaderSection() {
  return (
    <div className="w-full relative overflow-hidden bg-white rounded-2xl p-8 mb-8 border border-white/5 group">
      {/* Background Orbs for Cinematic Depth */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] group-hover:bg-primary-600/20 transition-colors duration-700"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/5 rounded-full blur-[80px]"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Cinematic Illustration Container */}
        <div className="w-full md:w-56 h-44 relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
          <Image
            src="/assets/sample1.jpg"
            alt="PG Illustration"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
        </div>

        {/* Text Content Area */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-600/10 border border-primary-600/20 text-primary-400 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
            Property Onboarding
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-700 font-display tracking-tight">
            Enlist Your <span className="text-primary-600">Accommodation</span>
          </h1>
          
          <p className="text-gray-500 max-w-2xl font-jakarta text-sm leading-relaxed mx-auto md:mx-0">
            Provide comprehensive details about your property to maximize visibility and connect with the ideal tenants. Precision in data ensures high-fidelity matching on the Guestify platform.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <button 
              className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary-600/20 active:scale-95" 
              onClick={()=> window.open('/terms-and-services', '_blank')}
            >
              <span>Review Terms of Service</span>
              <ArrowSquareOut size={18} weight="bold" />
            </button>
            <p className="text-[10px] text-gray-500 font-jakarta font-medium uppercase tracking-widest">
                Trusted by 5,000+ Owners
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
