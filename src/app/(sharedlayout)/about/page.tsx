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
      color: 'from-amber-400 to-yellow-500'
    },
    {
      icon: Heart,
      title: 'Affordable Prices',
      description: 'Find accommodations that fit your budget with transparent pricing and no hidden fees. Quality living at prices you can afford.',
      color: 'from-orange-400 to-amber-500'
    },
    {
      icon: CheckCircle,
      title: 'Easy Booking',
      description: 'Reserve your ideal PG in just a few clicks with our streamlined booking process. Quick, secure, and hassle-free.',
      color: 'from-yellow-400 to-amber-500'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our dedicated support team is available round the clock to assist you with any queries or concerns you might have.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Trophy,
      title: 'Quality Assurance',
      description: 'Regular quality checks and feedback systems ensure that all our listed properties maintain high standards consistently.',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Building a trusted community of students and professionals who can find their perfect home away from home.',
      color: 'from-orange-500 to-amber-600'
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg')] bg-cover bg-center opacity-20"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center text-white">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              About Guestify
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-100">
              Revolutionizing the way students and professionals find their perfect
              <span className="font-semibold text-buttons"> home away from home</span> in West Bengal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-buttons text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-buttonsHover transition-all duration-300 flex items-center gap-2 shadow-lg">
                Discover Our Story
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center group transition-all duration-500 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-buttons to-buttonsSecondary rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-buttons mb-2">{stat.value}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-800 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
              <h2 className="text-4xl md:text-5xl font-bold text-headingCol mb-6 leading-tight">
                Our Mission
              </h2>
              <p className="text-lg text-primaryText leading-relaxed mb-6">
                At Guestify, we understand that finding the right accommodation is more than just securing a roof over your head.
                It's about finding a space where you can thrive, study, and build lasting memories.
              </p>
              <p className="text-lg text-cardDesCol leading-relaxed">
                We're committed to bridging the gap between property owners and students, creating a trusted ecosystem
                where safety, affordability, and comfort come together seamlessly.
              </p>
            </div>
            <div className={`transition-all duration-800 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-buttons to-headingCol rounded-3xl transform rotate-3 shadow-2xl"></div>
                <img
                  src="https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
                  alt="Students in accommodation"
                  className="relative z-10 w-full h-80 object-cover rounded-3xl shadow-2xl border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-cardsBackground">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-headingCol mb-6">
              Why Choose Guestify?
            </h2>
            <p className="text-xl text-cardDesCol max-w-3xl mx-auto">
              Experience the difference with our comprehensive approach to student accommodation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-cardTitleCol mb-4 group-hover:text-headingCol transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-cardDesCol leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-headingCol mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-cardDesCol">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`text-center group transition-all duration-700 delay-${index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
              >
                <div className="bg-cardsBackground min-h-[220px] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-200">
                  <h3 className="text-2xl font-bold text-headingCol mb-4">
                    {value.title}
                  </h3>
                  <p className="text-primaryText leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 bg-cardsBackground">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-headingCol">
            Our Journey
          </h2>
          <p className="text-xl mb-8 max-w-4xl mx-auto leading-relaxed text-primaryText">
            Founded with a vision to simplify student accommodation in West Bengal, Guestify has grown from a simple idea
            to a trusted platform serving thousands of students and professionals across the region.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gradient-to-br from-buttons to-buttonsSecondary p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl font-bold mb-2 text-white">2020</div>
              <div className="text-lg text-white">Founded with a mission</div>
            </div>
            <div className="bg-gradient-to-br from-buttons to-buttonsSecondary p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl font-bold mb-2 text-white">2022</div>
              <div className="text-lg text-white">Expanded to 50+ cities</div>
            </div>
            <div className="bg-gradient-to-br from-buttons to-buttonsSecondary p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl font-bold mb-2 text-white">2024</div>
              <div className="text-lg text-white">Leading PG platform</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-headingCol mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-cardDesCol">
              Have questions? We're here to help you find your perfect stay
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-cardsBackground p-8 rounded-2xl shadow-lg text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-buttons to-headingCol rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <Envelope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-headingCol mb-4">Email Us</h3>
              <p className="text-primaryText mb-4">Quick response guaranteed</p>
              <a
                href="mailto:support@guestify.com"
                className="text-buttons font-semibold hover:text-buttonsHover transition-colors duration-300"
              >
                support@guestify.com
              </a>
            </div>

            <div className="bg-cardsBackground p-8 rounded-2xl shadow-lg text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-buttons to-headingCol rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-headingCol mb-4">Call Us</h3>
              <p className="text-primaryText mb-4">Speak directly with our team</p>
              <a
                href="tel:+919876543210"
                className="text-buttons font-semibold hover:text-buttonsHover transition-colors duration-300"
              >
                +91 98765 43210
              </a>
            </div>

            <div className="bg-cardsBackground p-8 rounded-2xl shadow-lg text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-buttons to-headingCol rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-headingCol mb-4">Visit Us</h3>
              <p className="text-primaryText mb-4">Our office location</p>
              <p className="text-buttons font-semibold">
                Kolkata, West Bengal
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}