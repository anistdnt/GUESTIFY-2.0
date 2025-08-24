import Link from "next/link";
import React from "react";

export default function CTASection() {
  return (
    <div className="bg-cardsBackground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-buttons mb-4">
          Ready to Find Your Perfect PG?
        </h2>
        <p className="text-xl text-primaryText mb-8 max-w-2xl mx-auto">
          Join thousands of students who have found their ideal accommodation
          through Guestify
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={"#searchbar"} className="bg-buttons text-white font-semibold px-8 py-3 rounded-lg hover:bg-buttonsHover transition-all duration-300 hover:scale-105">
            Start Searching
          </Link>
          <button className="border-2 border-buttons text-buttons font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-buttons transition-all duration-300 hover:scale-105">
            List Your Property
          </button>
        </div>
      </div>
    </div>
  );
}
