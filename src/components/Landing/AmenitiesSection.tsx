"use client";

import React from "react";
import { WifiHigh, ForkKnife, ShieldCheck, Lightning, HouseLine, UsersThree } from "@phosphor-icons/react";

const amenities = [
  {
    icon: <WifiHigh size={32} weight="duotone" />,
    title: "High-Speed WiFi",
    description: "Fiber-optic connectivity for seamless online classes and gaming.",
    color: "bg-blue-50 text-blue-600 border-blue-100"
  },
  {
    icon: <ForkKnife size={32} weight="duotone" />,
    title: "Nutritious Meals",
    description: "Home-style cooked meals prepared with hygiene and love.",
    color: "bg-orange-50 text-orange-600 border-orange-100"
  },
  {
    icon: <ShieldCheck size={32} weight="duotone" />,
    title: "24/7 Security",
    description: "CCTV surveillance and professional guards for your safety.",
    color: "bg-green-50 text-green-600 border-green-100"
  },
  {
    icon: <Lightning size={32} weight="duotone" />,
    title: "Power Backup",
    description: "Uninterrupted power supply for your study sessions.",
    color: "bg-yellow-50 text-yellow-600 border-yellow-100"
  },
  {
    icon: <HouseLine size={32} weight="duotone" />,
    title: "Housekeeping",
    description: "Regular cleaning and maintenance to keep your room fresh.",
    color: "bg-purple-50 text-purple-600 border-purple-100"
  },
  {
    icon: <UsersThree size={32} weight="duotone" />,
    title: "Student Community",
    description: "Interactive common areas to build life-long friendships.",
    color: "bg-pink-50 text-pink-600 border-pink-100"
  }
];

const AmenitiesSection = () => {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6 font-display tracking-tight">
            Premium <span className="italic-serif text-primary-600">Amenities</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-jakarta">
            Everything you need for a comfortable and productive student life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 group"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-colors duration-500 ${amenity.color}`}>
                {amenity.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-jakarta group-hover:text-primary-600 transition-colors">
                {amenity.title}
              </h3>
              <p className="text-gray-500 leading-relaxed font-jakarta">
                {amenity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
