import Link from "next/link";
import React from "react";

export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-new">
        <div className="bg-[#1a1a1a] rounded-3xl p-16 text-white text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="text-h2 text-white">
              Ready to find your perfect stay?
            </h2>
            <p className="text-body-new text-[#a1a1aa] max-w-[500px]">
              Join thousands of students and professionals who have found
              their ideal accommodation through Guestify.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#searchbar"
                className="btn-new btn-primary-new h-[52px] px-8 text-base"
              >
                Start Searching
              </Link>
              <button className="btn-new h-[52px] px-8 text-base bg-white/10 text-white border border-white/20 hover:bg-white/20">
                List Your Property
              </button>
            </div>
          </div>

          {/* Abstract decorative shapes */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[var(--primary-new)] opacity-20 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[var(--primary-new)] opacity-10 blur-[100px] rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
