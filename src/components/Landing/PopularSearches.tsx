import React from "react";

export default function PopularSearches() {
  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-cardTitleCol mb-6">
        Popular Colleges
      </h3>
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {[
          "Jadavpur University",
          "Presidency University",
          "Calcutta University",
          "IIT Kharagpur",
          "Heritage Institute",
          "Techno India",
          "WBUT",
          "Kalyani University",
          "MAKAUT",
          "St. Xavier's College",
          "Rabindra Bharati University",
          "NSHM Knowledge Campus",
        ].map((college, index) => (
          <button
            key={index}
            className="bg-cardsBackground hover:bg-buttons text-cardTitleCol hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md border border-buttons/20 hover:border-buttons"
          >
            {college}
          </button>
        ))}
      </div>
    </div>
  );
}
