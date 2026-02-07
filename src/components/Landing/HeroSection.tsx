"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    const timer = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-20 lg:pb-32 overflow-hidden bg-white">
      <div className="container-new">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div
            className={`flex flex-col gap-6 max-w-[560px] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {/* Badge */}
            <div className="badge-new bg-[var(--secondary-new)] text-[var(--secondary-foreground-new)] w-fit flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              No. 1 Student Accommodation in Bengal
            </div>

            {/* Heading */}
            <h1 className="text-6xl font-bold text-[var(--foreground)]">
              Find your home <br />
              <span className="text-[var(--primary-new)] text-6xl font-bold">away from home.</span>
            </h1>

            {/* Description */}
            <p className="text-body-new text-lg">
              Discover verified paying guest accommodations, hostels, and shared
              apartments near your campus or workplace.
            </p>

            {/* Modern Search Component */}
            {/* <div className="bg-white p-2 rounded-xl border border-[var(--border-new)] shadow-[var(--shadow-lg-new)] flex gap-2 items-center mt-4">
              <div className="flex items-center gap-3 flex-1 pl-3">
                <svg className="w-5 h-5 text-[var(--muted-foreground-new)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex flex-col flex-1">
                  <span className="text-xs text-[var(--muted-foreground-new)] font-medium">Location</span>
                  <input
                    type="text"
                    placeholder="Enter city or college"
                    className="border-none outline-none text-sm font-medium w-full"
                  />
                </div>
              </div>
              <div className="w-px h-8 bg-[var(--border-new)]"></div>
              <div className="flex items-center gap-3 flex-1 pl-3">
                <svg className="w-5 h-5 text-[var(--muted-foreground-new)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div className="flex flex-col flex-1">
                  <span className="text-xs text-[var(--muted-foreground-new)] font-medium">Type</span>
                  <select className="border-none outline-none text-sm font-medium w-full bg-transparent">
                    <option>Private Room</option>
                    <option>Shared Room</option>
                    <option>Apartment</option>
                  </select>
                </div>
              </div>
              <button className="btn-new btn-primary-new h-12 w-12 rounded-[10px] p-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div> */}

            {/* User Avatars and Rating */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex ml-3">
                <Image
                  src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FSouth%20Asian%2F1"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white -ml-3"
                />
                <Image
                  src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F18-25%2FSouth%20Asian%2F2"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white -ml-2"
                />
                <Image
                  src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FEast%20Asian%2F3"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white -ml-2"
                />
                <Image
                  src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F18-25%2FSouth%20Asian%2F4"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white -ml-2"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-sm">4.8/5</span>
                </div>
                <span className="text-small-new text-xs">from 10,000+ students</span>
              </div>
            </div>
          </div>

          {/* Right Image Grid */}
          <div
            className={`relative h-[500px] hidden lg:grid grid-cols-[1.2fr_1fr] gap-4 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
          >
            <div className="rounded-2xl overflow-hidden h-full">
              <Image
                src="https://storage.googleapis.com/banani-generated-images/generated-images/41803db5-5a91-40e2-b98c-4da7d0921c41.jpg"
                alt="Modern student apartment"
                width={400}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-4 h-full">
              <div className="rounded-2xl overflow-hidden h-[60%]">
                <Image
                  src="https://storage.googleapis.com/banani-generated-images/generated-images/667ff786-1d78-44c9-9347-a596e5ad67c9.jpg"
                  alt="Students studying together"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-[40%] bg-[var(--secondary-new)] flex items-center justify-center flex-col gap-2 text-center p-4">
                <span className="text-h2 text-[var(--primary-new)]">500+</span>
                <span className="text-label-new text-[var(--secondary-foreground-new)]">
                  Verified Properties
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
