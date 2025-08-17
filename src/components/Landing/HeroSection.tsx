export default function HeroSection() {
  const Features = [
    {
      title: "Verified Properties",
      description: "Quality assured accommodations",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Prime Locations",
      description: "Near colleges and universities",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: "Best Prices",
      description: "Transparent and affordable rates",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="bg-gray-100">
        {/* Hero Section */}
        <section className="relative bg-[url('/assets/about-us-banner.jpg')] bg-fixed bg-bottom bg-cover text-white min-h-[500px] flex flex-col justify-center items-center">
          <div className="w-full">
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative mx-auto max-w-7xl text-center px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Discover Your
                <span className="block text-buttons mt-2">Perfect PG Stay</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Your trusted platform for finding paying guest accommodations in
                West Bengal
              </p>

              {/* Feature highlights with icons and animations */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {Features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-buttons rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:rotate-6 group-hover:bg-buttonsSecondary transition-all duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-white mb-2 group-hover:text-buttonsSecondary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
