import { metadataMap } from '@/metadata/metadata.config';
import React from 'react'

export const metadata = metadataMap['terms_and_services'];

export default function TermsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-6 text-gray-700">
        Welcome to Guestify. These Terms of Service ("Terms") govern your use of our website,
        products, and services. By accessing or using our platform, you agree to these Terms. If you do not
        agree, please do not use our services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
      <p className="mb-6 text-gray-700">
        By accessing or using our services, you confirm that you are at least 18 years old or have the legal
        capacity to enter into these Terms. Continued use constitutes acceptance of any updates or changes
        we make to these Terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use of Services</h2>
      <p className="mb-6 text-gray-700">
        You agree to use our services only for lawful purposes. You must not use our platform to:
      </p>
      <ul className="list-disc list-inside mb-6 text-gray-700">
        <li>Engage in fraudulent, abusive, or illegal activities.</li>
        <li>Upload malicious software or harmful content.</li>
        <li>Violate the rights of others, including intellectual property rights.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
      <p className="mb-6 text-gray-700">
        To access certain features, you may need to create an account. You are responsible for maintaining
        the confidentiality of your account credentials and for all activities that occur under your account.
        Notify us immediately of any unauthorized use.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Payments & Billing</h2>
      <p className="mb-6 text-gray-700">
        If you purchase services through our platform, you agree to provide accurate payment information and
        authorize us to charge applicable fees. All payments are non-refundable unless otherwise specified.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
      <p className="mb-6 text-gray-700">
        All content, trademarks, logos, and intellectual property on our platform belong to [Your Company
        Name] or our licensors. You may not use, copy, or distribute any content without prior written
        consent.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Termination</h2>
      <p className="mb-6 text-gray-700">
        We reserve the right to suspend or terminate your account at any time if you violate these Terms or
        engage in harmful activities. Upon termination, your right to use our services will immediately end.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
      <p className="mb-6 text-gray-700">
        Our services are provided "as is" without warranties of any kind. We are not liable for damages,
        including loss of data, profits, or business opportunities, arising from the use of our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Privacy Policy</h2>
      <p className="mb-6 text-gray-700">
        Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use,
        and protect your personal information.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Governing Law</h2>
      <p className="mb-6 text-gray-700">
        These Terms are governed by and construed in accordance with the laws of [Your Country/State]. Any
        disputes arising will be subject to the exclusive jurisdiction of the courts located in [Your
        Location].
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
      <p className="mb-6 text-gray-700">
        If you have any questions about these Terms, please contact us at:
      </p>
      <p className="text-gray-700 font-medium">Email: support@[yourcompany].com</p>
    </div>
  );
}
