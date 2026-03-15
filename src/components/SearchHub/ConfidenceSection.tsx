"use client";

import React from "react";
import { ShieldCheck, UserFocus, Clock, CheckCircle } from "@phosphor-icons/react/dist/ssr";

const features = [
  {
    icon: <ShieldCheck size={32} weight="duotone" className="text-primary-600" />,
    title: "Verified Stays",
    description: "Every listing on our platform is physically verified by our team for safety and accuracy.",
    badge: "100% SECURE"
  },
  {
    icon: <UserFocus size={32} weight="duotone" className="text-primary-600" />,
    title: "Student Centric",
    description: "Designed specifically for students, focusing on proximity to colleges and budget limits.",
    badge: "SMART MATCH"
  },
  {
    icon: <CheckCircle size={32} weight="duotone" className="text-primary-600" />,
    title: "Direct Access",
    description: "Connect directly with owners. No middlemen, no hidden brokerage, just transparency.",
    badge: "ZERO BROKERAGE"
  }
];

export default function ConfidenceSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div 
            key={idx}
            className="group bg-white border border-gray-100 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 flex flex-col items-start gap-4 relative overflow-hidden"
          >
            {/* Subtle Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex items-center justify-between w-full relative z-10">
              <div className="p-3 bg-gray-50 rounded-2xl group-hover:scale-110 group-hover:bg-primary-50 transition-all duration-500">
                {feature.icon}
              </div>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                {feature.badge}
              </span>
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-semibold text-gray-900 font-display tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 font-jakarta leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
