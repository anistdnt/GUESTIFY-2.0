import Link from "next/link";
import React from "react";

export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-4xl md:text-6xl font-normal tracking-tight font-display leading-tight">
              Ready to find your <br />
              <span className="text-primary-500 italic-serif">perfect</span> stay?
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed font-jakarta">
              Join thousands of students and professionals who have found
              their ideal accommodation through Guestify.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mt-4">
              <Link
                href="#searchbar"
                className="bg-primary-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/30 transform hover:-translate-y-1"
              >
                Start Searching
              </Link>
              <button className="bg-white/10 text-white border-2 border-white/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all transform hover:-translate-y-1 backdrop-blur-sm">
                List Your Property
              </button>
            </div>
          </div>

          {/* Abstract decorative shapes - Using primary-600 for consistency */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-600 opacity-20 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-500 opacity-10 blur-[120px] rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary-600/5 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
