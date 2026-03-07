import CTASection from "@/components/Landing/CTASection";
import HeroSection from "@/components/Landing/HeroSection";
import HowItWorks from "@/components/Landing/HowItWorks";
import PopularSearches from "@/components/Landing/PopularSearches";
import Testimonials from "@/components/Landing/Testimonials";
import TrustBanner from "@/components/Landing/TrustBanner";
import { Districts } from "@/components/Searchbar/Districts";
import Searchbar from "@/components/Searchbar/Searchbar";

export default function Home() {
  return (
    <div suppressHydrationWarning={true}>
      {/* Hero Section with integrated search */}
      <HeroSection />

      {/* Trust Banner Section */}
      <TrustBanner />

      {/* College Search Section - Unified Search Hub */}
      <div id="searchbar" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6 font-display tracking-tight">
              Find Your <span className="italic-serif text-primary-600">Perfect</span> PG
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-jakarta">
              Search by your college name to discover nearby accommodations
            </p>
          </div>

          {/* Unified Hub Container */}
          <div className="space-y-12">
            {/* Search Input Area */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-4xl">
                <Searchbar />
              </div>
            </div>

            {/* Visual Search Aids */}
            <div className="space-y-16">
              <div className="bg-white p-8 rounded-[3rem] shadow-[0_0_25px_rgba(0,0,0,0.06)] border border-gray-100">
                <p className="text-center text-gray-500 font-medium mb-6 uppercase tracking-widest text-xs font-jakarta">Explore by <span className="italic-serif text-primary-600">District</span></p>
                <Districts />
              </div>
              
              <PopularSearches />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
