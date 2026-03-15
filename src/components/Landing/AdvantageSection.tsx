"use client";

import React from "react";
import { Handshake, SealCheck, Users } from "@phosphor-icons/react";

const advantages = [
  {
    icon: <Handshake size={48} weight="duotone" />,
    title: "Zero Brokerage",
    description: "Book directly with property owners. No hidden commissions, no extra fees. What you see is what you pay."
  },
  {
    icon: <SealCheck size={48} weight="duotone" />,
    title: "Verified Listings",
    description: "Every property is physically visited and verified by our ground team for safety, hygiene, and amenities."
  },
  {
    icon: <Users size={48} weight="duotone" />,
    title: "Student First",
    description: "Built for students, by people who understand student life. Join a vibrant community of like-minded peers."
  }
];

const AdvantageSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-primary-900 rounded-[3.5rem] p-12 lg:p-20 text-white relative overflow-hidden">
          {/* Background Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-800 rounded-full -mr-48 -mt-48 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-700 rounded-full -ml-32 -mb-32 opacity-20 blur-3xl"></div>
          
          <div className="relative text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-normal mb-6 font-display tracking-tight text-white">
              The <span className="italic-serif text-primary-400">Guestify</span> Advantage
            </h2>
            <p className="text-lg text-primary-100/80 max-w-2xl mx-auto font-jakarta">
              Why thousands of students and parents trust us for their accommodation needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {advantages.map((advantage, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-primary-400 border border-white/10 group hover:bg-white/20 transition-all duration-300">
                  {advantage.icon}
                </div>
                <h3 className="text-2xl font-bold font-jakarta text-white">{advantage.title}</h3>
                <p className="text-primary-100/70 leading-relaxed font-jakarta">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantageSection;
