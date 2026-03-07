'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Heart,
  Users,
  Star,
  CheckCircle,
  MapPin,
  Phone,
  Envelope,
  ArrowRight,
  Buildings,
  Clock,
  Trophy
} from '@phosphor-icons/react';
import CommonButton from '../../AppComponents/CommonButton';
import Image from 'next/image';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: '10,000+', label: 'Happy Guests', icon: Users },
    { value: '500+', label: 'Verified PGs', icon: Buildings },
    { value: '50+', label: 'Cities Covered', icon: MapPin },
    { value: '4.8/5', label: 'Average Rating', icon: Star },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'Every PG is thoroughly verified through our rigorous screening process to ensure safety, cleanliness, and reliability for our users.',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: Heart,
      title: 'Affordable Prices',
      description: 'Find accommodations that fit your budget with transparent pricing and no hidden fees. Quality living at prices you can afford.',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: CheckCircle,
      title: 'Easy Booking',
      description: 'Reserve your ideal PG in just a few clicks with our streamlined booking process. Quick, secure, and hassle-free.',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our dedicated support team is available round the clock to assist you with any queries or concerns you might have.',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: Trophy,
      title: 'Quality Assurance',
      description: 'Regular quality checks and feedback systems ensure that all our listed properties maintain high standards consistently.',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Building a trusted community of students and professionals who can find their perfect home away from home.',
      color: 'bg-primary-50 text-primary-600'
    }
  ];

  const values = [
    {
      title: 'Trust & Transparency',
      description: 'We believe in building lasting relationships through honest communication and transparent practices.'
    },
    {
      title: 'Quality First',
      description: 'Every listing meets our high standards for safety, cleanliness, and comfort before being featured on our platform.'
    },
    {
      title: 'Student-Centric',
      description: 'Understanding the unique needs of students and young professionals drives everything we do.'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-jakarta">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
          <div className={`flex-1 space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2 animate-pulse"></span>
              Our Story
            </div>
            <h1 className="text-5xl md:text-7xl font-normal leading-tight text-gray-900 font-display tracking-tight">
              Revolutionizing student <br />
              <span className="text-primary-600 italic-serif">living experience</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-jakarta">
              Guestify is on a mission to simplify the way students find their perfect home away from home in West Bengal, bringing trust and quality to every stay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <CommonButton variant="primary" size="lg" icon={<ArrowRight size={20} />}>
                Explore Listings
              </CommonButton>
            </div>
          </div>
          <div className={`flex-1 relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
             <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.08)] border-8 border-white">
                <img 
                  src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" 
                  alt="About Hero" 
                  className="w-full h-[500px] object-cover"
                />
             </div>
             {/* Decorative element */}
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-60"></div>
          </div>
        </div>
      </section>

      {/* Stats Section with uniform shadow cards */}
      <section className="py-24 bg-primary-50/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-[2rem] shadow-[0_0_20px_rgba(0,0,0,0.03)] border border-gray-100 text-center flex flex-col items-center gap-4 transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.06)] hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                  <stat.icon size={24} weight="bold" />
                </div>
                <div>
                  <div className="text-4xl font-normal font-display text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
                  alt="Students in accommodation"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-600 rounded-3xl -z-10 rotate-12"></div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-normal text-gray-900 font-display tracking-tight">
                Our <span className="italic-serif text-primary-600">Mission</span> & Vision
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  At Guestify, we understand that finding the right accommodation is more than just securing a roof over your head. It's about finding a space where you can thrive, study, and build lasting memories.
                </p>
                <p>
                  We're committed to bridging the gap between property owners and students, creating a trusted ecosystem where safety, affordability, and comfort come together seamlessly.
                </p>
              </div>
              <div className="pt-4">
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center">
                       <CheckCircle size={20} weight="bold" />
                    </div>
                    <span className="font-semibold text-gray-900 tracking-tight">Trusted by 10k+ Students</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-normal text-gray-900 font-display tracking-tight">
              Why <span className="italic-serif text-primary-600">Choose</span> Guestify?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our comprehensive approach to student accommodation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-10 rounded-[2.5rem] shadow-[0_0_25px_rgba(0,0,0,0.03)] hover:shadow-[0_0_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 border border-gray-100 group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={28} weight="bold" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-jakarta">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-4xl md:text-5xl font-normal text-gray-900 font-display tracking-tight">
                Our core <br /> <span className="italic-serif text-primary-600">values</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                The principles that guide everything we do to ensure you find your perfect stay.
              </p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-[2rem] shadow-[0_0_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-primary-200 transition-colors"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 font-display">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm font-jakarta">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modern Journey/Timeline */}
      <section className="py-32 bg-gray-900 text-white rounded-[4rem] mx-6 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px]"></div>
        <div className="mx-auto max-w-5xl px-6 text-center relative z-10 space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-normal font-display tracking-tight">
              Our <span className="italic-serif text-primary-400">Journey</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Founded with a vision to simplify student accommodation in West Bengal, Guestify has grown to a trusted platform serving thousands of students.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 text-center space-y-4">
              <div className="text-5xl font-display text-primary-400">2020</div>
              <p className="text-lg font-bold">Founded</p>
              <p className="text-sm text-gray-400">Mission to solve student housing challenges</p>
            </div>
            <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 text-center space-y-4">
              <div className="text-5xl font-display text-primary-400">2022</div>
              <p className="text-lg font-bold">Expansion</p>
              <p className="text-sm text-gray-400">Reached 50+ major educational hubs</p>
            </div>
            <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 text-center space-y-4">
              <div className="text-5xl font-display text-primary-400">2024+</div>
              <p className="text-lg font-bold">Leadership</p>
              <p className="text-sm text-gray-400">Bengal's leading PG search platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Info */}
      <section className="pb-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="bg-primary-600 rounded-[3rem] p-12 md:p-20 text-white text-center flex flex-col items-center gap-8 shadow-2xl shadow-primary-600/20">
            <h2 className="text-4xl md:text-6xl font-normal font-display tracking-tight">Ready to find your <span className="italic-serif text-white/90">next home</span>?</h2>
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
              Our team is here to help you every step of the way. Get in touch or browse our latest listings.
            </p>
            <div className="grid sm:grid-cols-3 gap-8 w-full max-w-4xl mt-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><Envelope size={24} /></div>
                <span className="font-bold">support@guestify.com</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><Phone size={24} /></div>
                <span className="font-bold">+91 98765 43210</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><MapPin size={24} /></div>
                <span className="font-bold">Kolkata, WB</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}