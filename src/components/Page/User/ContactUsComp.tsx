"use client";
import React, { useEffect, useState } from 'react';
import { Envelope, Phone, MapPin, PaperPlaneTilt, ChatCircle, Clock, CheckCircle } from '@phosphor-icons/react';
import CommonButton from '../../AppComponents/CommonButton';

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
      bgColor: "bg-primary-50 text-primary-600"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+91 88888 88888",
      link: "tel:+918888888888",
      bgColor: "bg-primary-50 text-primary-600"
    },
    {
      icon: MapPin,
      title: "Address",
      content: "Kolkata, WB, India",
      link: "#",
      bgColor: "bg-primary-50 text-primary-600"
    },
    {
      icon: ChatCircle,
      title: "Hours",
      content: "Mon - Fri: 9AM - 6PM",
      link: "#",
      bgColor: "bg-primary-50 text-primary-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-jakarta">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-8">
              <ChatCircle className="w-4 h-4" weight="bold" />
              Get in Touch
            </div>
            <h1 className="text-5xl md:text-7xl font-normal leading-tight text-gray-900 font-display tracking-tight mb-8">
              Let's Start a <br />
              <span className="text-primary-600 italic-serif">Conversation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-jakarta">
              We're here to help you find the perfect accommodation. Reach out with any questions, 
              feedback, or partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div
            className={`transition-all duration-1000 delay-200 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-10 lg:p-14 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.04)] border border-gray-100">
                  <div className="mb-10 space-y-2">
                    <h2 className="text-4xl font-normal text-gray-900 font-display tracking-tight">
                      Send us a <span className="italic-serif text-primary-600">message</span>
                    </h2>
                    <p className="text-gray-500 font-jakarta">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:bg-white focus:border-primary-600 transition-all duration-300 font-jakarta"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:bg-white focus:border-primary-600 transition-all duration-300 font-jakarta"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:bg-white focus:border-primary-600 transition-all duration-300 appearance-none font-jakarta"
                      >
                        <option value="">Select a topic</option>
                        <option value="accommodation">Accommodation Inquiry</option>
                        <option value="booking">Booking Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        required
                        rows={6}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:bg-white focus:border-primary-600 transition-all duration-300 resize-none font-jakarta"
                      />
                    </div>

                    <div className="pt-4">
                      <CommonButton 
                        variant={isSubmitted ? "outline" : "primary"} 
                        size="xl" 
                        className={`w-full justify-center ${isSubmitted ? 'border-green-500 text-green-600' : ''}`}
                        disabled={isSubmitting}
                      >
                        <span className="flex items-center gap-2">
                          {isSubmitted ? (
                            <>
                              <CheckCircle className="w-6 h-6" weight="bold" />
                              SUCCESSFULLY SENT
                            </>
                          ) : isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              SENDING...
                            </>
                          ) : (
                            <>
                              <PaperPlaneTilt className="w-6 h-6" weight="bold" />
                              SEND MESSAGE
                            </>
                          )}
                        </span>
                      </CommonButton>
                    </div>
                  </form>
                </div>
              </div>

              {/* Contact Information & Sidebar */}
              <div className="flex flex-col gap-8">
                <div className="bg-white p-10 rounded-[3rem] shadow-[0_0_40px_rgba(0,0,0,0.03)] border border-gray-100 flex-1">
                  <h3 className="text-2xl font-normal text-gray-900 font-display tracking-tight mb-8">
                    Contact <span className="italic-serif text-primary-600">Info</span>
                  </h3>
                  <div className="space-y-8">
                    {contactInfo.map((info, index) => (
                      <div
                        key={index}
                        className="group flex items-start gap-4 p-2 transition-all"
                      >
                        <div className={`w-12 h-12 rounded-2xl ${info.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <info.icon size={22} weight="bold" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {info.title}
                          </h4>
                          {info.link !== "#" ? (
                            <a href={info.link} className="text-gray-900 font-semibold hover:text-primary-600 transition-colors">
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-gray-900 font-semibold">
                              {info.content}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary-600 rounded-[3rem] p-10 text-white space-y-6 relative overflow-hidden shadow-2xl shadow-primary-600/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                   <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                       <Clock size={32} weight="bold" />
                   </div>
                   <div className="space-y-4">
                     <h3 className="text-2xl font-display tracking-tight leading-tight">Fast <span className="italic-serif opacity-90">Response</span> Guaranteed</h3>
                     <p className="text-white/80 leading-relaxed text-sm font-jakarta">
                        We typically respond within 2-4 hours. For urgent booking support, please choose the correct subject in the form.
                     </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with unified style */}
      <section className="px-6 pb-32 bg-gray-50/50 pt-24">
        <div
          className={`max-w-5xl mx-auto transition-all duration-1000 delay-500 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-normal text-gray-900 font-display tracking-tight leading-tight">
              Frequently Asked <span className="italic-serif text-primary-600">Questions</span>
            </h2>
            <p className="text-gray-500 text-lg font-jakarta">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                className="bg-white p-10 rounded-[2.5rem] shadow-[0_0_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] transition-all duration-300 group"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-display tracking-tight group-hover:text-primary-600 transition-colors">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed font-jakarta">
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