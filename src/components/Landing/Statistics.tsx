import React from "react";

function Statistics() {
  return (
    <div className="bg-cardsBackground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-headingCol mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-primaryText">
            Join our growing community of satisfied students
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              number: "500+",
              label: "Verified PGs",
              icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            },
            {
              number: "1000+",
              label: "Happy Students",
              icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
            },
            {
              number: "50+",
              label: "Cities Covered",
              icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
            },
            {
              number: "24/7",
              label: "Support",
              icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            },
          ].map((stat, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-buttons transition-all duration-300">
                <svg
                  className="w-8 h-8 text-buttons group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={stat.icon}
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-headingCol mb-2 group-hover:text-buttons transition-colors duration-300">
                {stat.number}
              </div>
              <div className="text-cardDesCol group-hover:text-primaryText transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
