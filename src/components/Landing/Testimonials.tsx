import React from "react";

type Props = {};

export default function Testimonials({}: Props) {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-headingCol mb-4">
            What Students Say
          </h2>
          <p className="text-lg text-primaryText">
            Real experiences from our community
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Priya Sharma",
              college: "Jadavpur University",
              rating: 5,
              review:
                "Found the perfect PG near my college within hours. The verification process gave me confidence in my choice.",
            },
            {
              name: "Rahul Das",
              college: "IIT Kharagpur",
              rating: 5,
              review:
                "Amazing platform! The search filters helped me find exactly what I was looking for. Highly recommended.",
            },
            {
              name: "Sneha Roy",
              college: "Presidency University",
              rating: 5,
              review:
                "Great experience using Guestify. The property details were accurate and the booking process was smooth.",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-cardsBackground rounded-lg p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-buttons rounded-full flex items-center justify-center text-white font-semibold group-hover:bg-buttonsSecondary transition-colors duration-300">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-cardTitleCol group-hover:text-headingCol transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-cardDesCol">
                    {testimonial.college}
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-ratingStarCol"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-cardDesCol italic group-hover:text-primaryText transition-colors duration-300">
                "{testimonial.review}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
