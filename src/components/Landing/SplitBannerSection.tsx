"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, CheckCircle, SealCheck } from "@phosphor-icons/react";

const SplitBannerSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Cinematic Image with Floating Elements */}
          <div className="flex-1 relative group w-full">
            <div className="relative h-[500px] w-full rounded-[3rem] overflow-hidden shadow-2xl">
              <Image
                src="/assets/about-us-banner.jpg"
                alt="Premium Student Living"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce-slow">
              <div className="p-3 bg-primary-50 rounded-2xl text-primary-600">
                <SealCheck size={32} weight="fill" />
              </div>
              <div>
                <p className="text-gray-900 font-bold font-jakarta">Verified Stays</p>
                <p className="text-gray-500 text-sm font-jakarta">100% Quality Assurance</p>
              </div>
            </div>
            
            {/* Decorative Background */}
            <div className="absolute -z-10 -top-12 -left-12 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-60"></div>
          </div>

          {/* Right: Persuasive Content */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 text-green-700 font-medium text-xs uppercase tracking-widest font-jakarta border border-green-100">
              <ShieldCheck size={16} className="mr-2" weight="bold" />
              Your Security is Our Priority
            </div>
            
            <h2 className="text-4xl md:text-5xl font-normal text-gray-900 leading-tight font-display tracking-tight">
              Safety First, <br />
              <span className="italic-serif text-primary-600">Comfort</span> Always.
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed font-jakarta">
              We understand that moving to a new city is a big step. That's why every single property on Guestify undergoes a rigorous 50-point safety check before it's listed.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                "Physically verified by our ground team",
                "24/7 emergency support for every student",
                "Transparent reviews from the student community",
                "Premium amenities included in every budget"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="text-primary-600 bg-primary-50 p-1 rounded-full">
                    <CheckCircle size={20} weight="fill" />
                  </div>
                  <span className="text-gray-700 font-medium font-jakarta">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-8">
               <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-gray-900 font-display">5,000+</span>
                    <span className="text-sm text-gray-500 font-jakarta">Students Trusted</span>
                  </div>
                  <div className="w-px h-12 bg-gray-100"></div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-gray-900 font-display">200+</span>
                    <span className="text-sm text-gray-500 font-jakarta">Verified PGs</span>
                  </div>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default SplitBannerSection;
