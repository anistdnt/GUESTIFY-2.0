"use client";

import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Search & Compare",
      description:
        "Filter by distance, price, and amenities to find your perfect match near campus.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Schedule a Visit",
      description:
        "Book a virtual or in-person tour with our verified landlords instantly through the app.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      title: "Book & Move In",
      description:
        "Sign the lease digitally and pay securely. Collect your keys and start your semester.",
    },
  ];

  return (
    <section className="py-24 bg-gray-50" suppressHydrationWarning={true}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-16">
        <div className="text-center flex flex-col gap-4 max-w-[700px]">
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 font-display tracking-tight">
            Simple <span className="italic-serif text-primary-600">3-step</span> booking
          </h2>
          <p className="text-lg text-gray-600 font-jakarta">
            The easiest way to find your next student home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col gap-6 items-center text-center group"
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-100">
                {step.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-normal text-gray-900 font-display tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base font-jakarta">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}