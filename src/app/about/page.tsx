import Head from "next/head";

const About = () => {
  return (
    <>
      <Head>
        <title>About Us - Guestify</title>
        <meta name="description" content="Learn more about Guestify, the best platform for finding paying guests in West Bengal." />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Hero Section */}
        <section className="relative bg-[url('/assets/about-us-banner.jpg')] bg-fixed bg-bottom bg-cover text-white h-72 flex flex-row justify-center items-center">
        <div className="absolute inset-0 bg-black bg-opacity-35"></div>
          <div className="relative mx-auto max-w-7xl text-center">
            <h1 className="text-5xl font-bold">About Guestify</h1>
            <p className="mt-4 text-lg">
              Your trusted platform for finding paying guest accommodations in West Bengal.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mx-auto py-16 px-6 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600 text-center">
            We aim to connect students and working professionals with the best PG accommodations 
            across West Bengal, offering a seamless and hassle-free experience.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white py-16">
          <div className="mx-auto text-center max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-800">Why Choose Guestify?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="p-6 bg-gray-100 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-600">Verified Listings</h3>
                <p className="mt-2 text-gray-600">Every PG is verified to ensure safety and reliability.</p>
              </div>
              <div className="p-6 bg-gray-100 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-600">Affordable Prices</h3>
                <p className="mt-2 text-gray-600">Find PGs that suit your budget without hidden costs.</p>
              </div>
              <div className="p-6 bg-gray-100 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-600">Easy Booking</h3>
                <p className="mt-2 text-gray-600">Reserve your stay with just a few clicks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-blue-600 text-white py-16 text-center">
          <h2 className="text-3xl font-bold">Get in Touch</h2>
          <p className="mt-2 text-lg">Have questions? Reach out to us at <a href="mailto:support@guestify.com" className="underline">support@guestify.com</a></p>
        </section>
      </div>
    </>
  );
};

export default About;
