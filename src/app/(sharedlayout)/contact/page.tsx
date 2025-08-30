"use client";
import React, { useEffect, useState } from 'react';
import { Envelope, Phone, MapPin, PaperPlaneTilt, ChatCircle, Clock, CheckCircle } from '@phosphor-icons/react';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    
    // Reset success state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: Envelope,
      title: "Email",
      content: "support@guestify.com",
      link: "mailto:support@guestify.com",
      bgColor: "bg-buttons"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+91 88888 88888",
      link: "tel:+918888888888",
      bgColor: "bg-buttonsSecondary"
    },
    {
      icon: MapPin,
      title: "Address",
      content: "Kolkata, West Bengal, India",
      link: "#",
      bgColor: "bg-priceCol"
    },
    {
      icon: ChatCircle,
      title: "Business Hours",
      content: "Mon - Fri: 9AM - 6PM",
      link: "#",
      bgColor: "bg-ratingStarCol"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-buttons/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-buttonsSecondary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-headingCol/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cardsBackground/20 backdrop-blur-sm rounded-full text-gray-300 text-sm font-medium mb-6">
              <ChatCircle className="w-4 h-4" />
              Get in Touch
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
              Let's Start a<br />
              <span className="bg-gradient-to-r from-buttons via-buttonsSecondary to-headingCol bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed text-gray-300 font-light">
              We're here to help you find the perfect accommodation. Reach out with any questions, 
              feedback, or partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="relative -mt-16 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div
            className={`transition-all duration-1000 delay-200 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-cardsBackground/80 backdrop-blur-sm p-8 lg:p-12 rounded-3xl shadow-xl border border-cardsBackground/40">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-cardTitleCol mb-3">
                      Send us a message
                    </h2>
                    <p className="text-cardDesCol leading-relaxed">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-cardTitleCol mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-buttons focus:border-transparent transition-all duration-300 group-hover:border-gray-300"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-cardTitleCol mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-buttons focus:border-transparent transition-all duration-300 group-hover:border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-cardTitleCol mb-2">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-buttons focus:border-transparent transition-all duration-300 group-hover:border-gray-300"
                      >
                        <option value="">Select a topic</option>
                        <option value="accommodation">Accommodation Inquiry</option>
                        <option value="booking">Booking Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-cardTitleCol mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-buttons focus:border-transparent transition-all duration-300 group-hover:border-gray-300 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || isSubmitted}
                      className={`w-full relative py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                        isSubmitted
                          ? "bg-green-500 text-white"
                          : isSubmitting
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-buttons hover:bg-buttonsHover text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isSubmitted ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Message Sent Successfully!
                          </>
                        ) : isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <PaperPlaneTilt className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-cardsBackground/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-cardsBackground/40">
                  <h3 className="text-2xl font-bold text-cardTitleCol mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div
                        key={index}
                        className="group cursor-pointer"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <a
                          href={info.link}
                          className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 transition-all duration-300 group-hover:scale-105"
                        >
                          <div className={`p-3 rounded-xl ${info.bgColor} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                            <info.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-cardTitleCol group-hover:text-headingCol transition-colors">
                              {info.title}
                            </h4>
                            <p className="text-cardDesCol mt-1 group-hover:text-primaryText transition-colors">
                              {info.content}
                            </p>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info Card */}
                <div className="bg-gradient-to-br from-cardsBackground to-cardsBackground/70 p-8 rounded-3xl border border-buttons/20">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-buttons to-buttonsSecondary rounded-2xl mb-4">
                      <ChatCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-cardTitleCol mb-3">
                      Quick Response
                    </h3>
                    <p className="text-cardDesCol leading-relaxed">
                      We typically respond to all inquiries within 2-4 hours during business hours. 
                      For urgent matters, please call us directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 pb-24">
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 delay-500 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-headingCol mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-cardDesCol text-lg">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How do I book accommodation?",
                answer: "You can browse and book accommodations directly through our platform. Simply search for your preferred location and dates."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, debit cards, UPI, and net banking for secure and convenient payments."
              },
              {
                question: "Can I cancel my booking?",
                answer: "Yes, you can cancel your booking according to the cancellation policy of each property, which varies by accommodation."
              },
              {
                question: "Do you provide 24/7 support?",
                answer: "We offer support during business hours and emergency contact for urgent issues. You can reach us anytime via email."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-cardsBackground/60 backdrop-blur-sm p-6 rounded-2xl border border-cardsBackground/50 hover:border-buttons/30 transition-all duration-300 hover:shadow-lg group"
              >
                <h3 className="font-semibold text-cardTitleCol mb-3 group-hover:text-headingCol transition-colors">
                  {faq.question}
                </h3>
                <p className="text-cardDesCol leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;