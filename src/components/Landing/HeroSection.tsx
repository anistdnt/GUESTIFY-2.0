"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CommonButton from "../AppComponents/CommonButton";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-20 px-6 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-12 overflow-hidden bg-white">
      {/* Left Content */}
      <div className={`flex-1 space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2 animate-pulse"></span>
          No. 1 Student Accommodation in Bengal
        </div>
        <h1 className="text-5xl md:text-6xl font-normal leading-tight text-gray-900 font-display tracking-tight">
          Your home away <br />
          <span className="text-primary-600 italic-serif">from campus</span> starts here.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto md:mx-0 leading-relaxed font-jakarta">
          Discover thousands of vetted apartments, dorms, and shared spaces designed for the modern student lifestyle.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center md:justify-start">
          <CommonButton
            href="#searchbar"
            variant="primary"
            size="lg"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
          >
            Get Started
          </CommonButton>
          <CommonButton
            href="/listings"
            variant="outline"
            size="lg"
          >
            View Listings
          </CommonButton>
        </div>

        {/* User Avatars and Rating */}
        <div className="flex items-center gap-4 mt-12 justify-center md:justify-start">
          <div className="flex -space-x-3">
             <Image src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FSouth%20Asian%2F1" alt="User" width={40} height={40} className="rounded-full border-2 border-white" />
             <Image src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F18-25%2FSouth%20Asian%2F2" alt="User" width={40} height={40} className="rounded-full border-2 border-white" />
             <Image src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FEast%20Asian%2F3" alt="User" width={40} height={40} className="rounded-full border-2 border-white" />
             <Image src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F18-25%2FSouth%20Asian%2F1" alt="User" width={40} height={40} className="rounded-full border-2 border-white" />
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-lg">★★★★★</span>
              <span className="font-bold text-gray-900">4.8/5</span>
            </div>
            <span className="text-gray-500 text-sm">from 10,000+ students</span>
          </div>
        </div>
      </div>

      {/* Right Content - Visual Grid */}
      <div className={`flex-1 relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
        <div className="grid grid-cols-2 gap-6 p-4">
          <div className="space-y-6">
            <div className="h-64 bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src="https://storage.googleapis.com/banani-generated-images/generated-images/41803db5-5a91-40e2-b98c-4da7d0921c41.jpg"
                alt="Modern Student Living"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-40 bg-primary-100 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <span className="text-primary-600 text-4xl font-black mb-1">500+</span>
              <span className="text-primary-800 font-bold uppercase tracking-wider text-sm">Verified Stays</span>
            </div>
          </div>
          <div className="pt-12 space-y-6">
            <div className="h-40 bg-gray-900 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500 text-white">
              <span className="text-sm font-medium opacity-80 mb-2">Member of</span>
              <span className="font-bold text-primary-400 text-lg">Student Housing Association</span>
            </div>
            <div className="h-64 bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src="https://storage.googleapis.com/banani-generated-images/generated-images/8ec4f67d-d971-460b-88a5-d8ca2a6f69ca.jpg"
                alt="Shared Space"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-50 rounded-full blur-[120px] opacity-60"></div>
      </div>
    </section>
  );
};

export default HeroSection;
