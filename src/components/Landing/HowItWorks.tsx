import React from 'react'

export default function HowItWorks() {
  return (
    <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-headingCol mb-4">How It Works</h2>
            <p className="text-lg text-primaryText max-w-2xl mx-auto">Find your perfect PG in just 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Search", description: "Enter your college name and find nearby PG accommodations", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
              { step: "02", title: "Compare", description: "View detailed information, photos, and reviews of each property", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { step: "03", title: "Book", description: "Contact property owners directly and secure your accommodation", icon: "M5 13l4 4L19 7" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-cardsBackground rounded-full flex items-center justify-center mx-auto group-hover:bg-buttons group-hover:scale-110 transition-all duration-300">
                    <svg className="w-8 h-8 text-buttons group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <span className="absolute -top-2 -right-2 bg-buttons text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-buttonsSecondary transition-colors duration-300">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-cardTitleCol mb-3 group-hover:text-headingCol transition-colors duration-300">{item.title}</h3>
                <p className="text-cardDesCol group-hover:text-primaryText transition-colors duration-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

  )
}