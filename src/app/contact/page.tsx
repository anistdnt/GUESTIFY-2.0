"use client";
import Head from "next/head";
import { useState } from "react";

type Formdata = {
  name : string;
  email : string;
  message : string;
}

const Contact = () => {
  const [formData, setFormData] = useState<Formdata>({
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

      <div className="bg-gray-100">
        {/* Hero Section */}
        <section className="relative bg-[url('/assets/contact-us-banner.jpg')] bg-fixed bg-center text-white h-72 flex flex-row justify-center items-center">
        <div className="absolute inset-0 bg-black bg-opacity-35"></div>
          <div className="relative text-center">
          <h1 className="text-5xl font-bold">Contact Us</h1>
          <p className="mt-2 text-lg">Have questions? We’d love to hear from you.</p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="mx-auto py-16 px-6 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="mt-8 bg-white p-8 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="eg : John Doe"
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
                placeholder="eg : John@gmail.com"
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
                placeholder="Type Message here...."
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button type="submit" className="w-full bg-buttons text-white py-2 rounded-lg hover:bg-buttonsHover">
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
