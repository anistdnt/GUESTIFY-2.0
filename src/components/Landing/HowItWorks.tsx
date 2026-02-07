"use client";

import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Search & Compare",
      description:
        "Browse through verified listings near your college or office. Filter by price, amenities, and ratings.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Schedule a Visit",
      description:
        "Like what you see? Schedule a physical visit or request a video tour directly through the platform.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      title: "Book & Move In",
      description:
        "Secure your room with zero brokerage. Complete digital paperwork and move in hassle-free.",
    },
  ];

  return (
    <section className="py-24 bg-white" suppressHydrationWarning={true}>
      <div className="container-new flex flex-col items-center gap-12">
        <div className="text-center flex flex-col gap-4 max-w-[600px]">
          <h2 className="text-h2 text-[var(--foreground)]">
            Simple and seamless process
          </h2>
          <p className="text-body-new">
            Finding verified accommodation shouldn't be stressful. We've
            simplified the journey into three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              className="card-new card-hover-new flex flex-col gap-4 items-start group cursor-pointer"
            >
              <div className="w-12 h-12 bg-[var(--secondary-new)] rounded-xl flex items-center justify-center text-[var(--primary-new)] group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-h3 text-xl text-[var(--foreground)]">
                {step.title}
              </h3>
              <p className="text-body-new">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}