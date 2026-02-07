import React from "react";
import Image from "next/image";

type Props = {};

export default function Testimonials({ }: Props) {
  const testimonials = [
    {
      name: "Priya Sharma",
      college: "Student, Jadavpur Univ.",
      rating: 5,
      review:
        "Found the perfect PG near Jadavpur University within 2 days. The verification process gave me confidence in my choice.",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FSouth%20Asian%2F5",
    },
    {
      name: "Rahul Das",
      college: "IT Professional",
      rating: 5,
      review:
        "Amazing platform! The search filters helped me find exactly what I was looking for. Highly recommended for newcomers.",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F18-25%2FSouth%20Asian%2F6",
    },
    {
      name: "Sneha Roy",
      college: "Student, Presidency Univ.",
      rating: 5,
      review:
        "Great experience using Guestify. The property details were accurate and the booking process was smooth.",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FSouth%20Asian%2F7",
    },
  ];

  return (
    <section className="bg-[var(--secondary-new)] py-20">
      <div className="container-new">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <h2 className="text-h2 text-[var(--foreground)]">Trusted by thousands</h2>
          <p className="text-body-new">
            Don't just take our word for it. Here's what students are saying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-body-new mb-6 italic">
                "{testimonial.review}"
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="text-label-new font-semibold text-[var(--foreground)]">
                    {testimonial.name}
                  </div>
                  <div className="text-small-new text-xs">
                    {testimonial.college}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
