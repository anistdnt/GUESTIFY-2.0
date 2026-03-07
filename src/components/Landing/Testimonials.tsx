import React from "react";
import Image from "next/image";

type Props = {};

export default function Testimonials({ }: Props) {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      college: "Student, NYU Class of 2025",
      rating: 5,
      review:
        "Finding an apartment near NYU while living in London was stressful until I found Guestify. The virtual tour and verified reviews were lifesavers.",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FSouth%20Asian%2F5",
    },
    {
      name: "David Chen",
      college: "UT Austin Senior",
      rating: 5,
      review:
        "The easiest booking process I've ever experienced. I found a great shared house in Austin within 2 days. The roommate matching feature is a bonus!",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F18-25%2FSouth%20Asian%2F6",
    },
    {
      name: "Marcus Thorne",
      college: "Stanford Grad Student",
      rating: 5,
      review:
        "As a graduate student, I needed a quiet place with good WiFi. Guestify's filters helped me find exactly what I was looking for. Highly recommended.",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FSouth%20Asian%2F7",
    },
  ];

  return (
    <section className="bg-primary-50 py-24 font-jakarta">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 font-display tracking-tight">Loved by students <span className="italic-serif text-primary-600">worldwide</span></h2>
          <p className="text-lg text-gray-600 font-jakarta">
            See why over 10,000+ students trust Guestify every year.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-[2.5rem] p-8 shadow-[0_0_15px_rgba(0,0,0,0.03)] hover:shadow-[0_0_30px_rgba(0,0,0,0.08)] transition-all duration-500 border border-primary-100/50"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-primary-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-8 italic text-lg leading-relaxed font-jakarta">
                "{testimonial.review}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12">
                   <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover border-2 border-primary-100"
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900 font-display text-lg tracking-tight">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-500 font-jakarta">
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
