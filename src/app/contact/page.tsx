"use client";
import Head from "next/head";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Head>
        <title>Contact Us - Guestify</title>
        <meta name="description" content="Get in touch with Guestify for inquiries about PG accommodations in West Bengal." />
      </Head>

      <div className="bg-gray-100 max-w-7xl">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-20 text-center">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-lg">Have questions? We’d love to hear from you.</p>
        </section>

        {/* Contact Form */}
        <section className="mx-auto py-16 px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="mt-8 bg-white p-8 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Send Message
            </button>
          </form>
        </section>

        {/* Contact Details */}
        <section className="bg-white py-16">
          <div className="mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
            <p className="mt-4 text-lg text-gray-600">You can also reach us through the following ways:</p>
            <div className="mt-6 space-y-4">
              <p className="text-gray-700">
                📧 Email: <a href="mailto:support@guestify.com" className="text-blue-600 underline">support@guestify.com</a>
              </p>
              <p className="text-gray-700">
                📞 Phone: <a href="tel:+918888888888" className="text-blue-600 underline">+91 88888 88888</a>
              </p>
              <p className="text-gray-700">
                📍 Address: Kolkata, West Bengal, India
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
