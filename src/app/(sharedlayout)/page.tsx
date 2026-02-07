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

      {/* College Search Section - Keeping the existing searchbar functional */}
      <div id="searchbar" className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-headingCol mb-4">
              Find Your Perfect PG
            </h2>
            <p className="text-lg text-primaryText">
              Search by your college name to discover nearby accommodations
            </p>
          </div>

          <div>
            <Districts />
          </div>

          <div>
            <div className="bg-gray-100 py-10">
              <Searchbar />
            </div>
            <PopularSearches />
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
