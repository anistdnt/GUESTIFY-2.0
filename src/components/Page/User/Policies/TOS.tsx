"use client";

import { AlarmIcon, FileIcon, ShieldIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const LAST_UPDATED = "15 January 2026";

export default function TermsComp() {
  const [activeId, setActiveId] = useState<string>("introduction");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* LEFT – Sticky TOC */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white/80 backdrop-blur-xl border border-amber-200/50 rounded-2xl p-6 shadow-lg shadow-amber-100/50">
                <div className="flex items-center gap-2 mb-6">
                  <FileIcon className="w-4 h-4 text-amber-600" />
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                    Contents
                  </p>
                </div>

                <nav>
                  <ul className="space-y-1 text-sm">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`block rounded-lg px-3 py-2.5 transition-all duration-200 ${
                            activeId === item.id
                              ? "bg-amber-500 text-white font-medium shadow-md shadow-amber-200"
                              : "text-gray-600 hover:bg-amber-50 hover:text-amber-900"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="truncate">{item.label}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </aside>

          {/* RIGHT – Content */}
          <main className="lg:col-span-3">
            <article className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl shadow-indigo-100/50 overflow-hidden">
              {/* Header with Gradient */}
              <header className="relative bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 px-10 py-16 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium">
                    <ShieldIcon className="w-4 h-4" />
                    Legal Document
                  </div>

                  <h1 className="text-5xl font-bold tracking-tight">
                    Terms of Service
                  </h1>

                  <p className="text-amber-100 text-lg max-w-3xl leading-relaxed">
                    These Terms of Service establish the legal framework
                    governing your relationship with Guestify. Please read
                    carefully to understand your rights, responsibilities, and
                    obligations while using our platform.
                  </p>

                  <div className="flex items-center gap-2 text-sm text-amber-200">
                    <AlarmIcon className="w-4 h-4" />
                    <span>
                      <strong>Last updated:</strong> {LAST_UPDATED}
                    </span>
                  </div>
                </div>
              </header>

              <div className="px-10 py-12 space-y-16">
                <Section id="introduction" title="Introduction">
                  <p>
                    Welcome to Guestify, a comprehensive digital platform
                    engineered to revolutionize the Paying Guest (PG)
                    accommodation ecosystem. Our platform serves as a bridge
                    connecting students, working professionals, and property
                    owners, facilitating seamless discovery, verification,
                    booking, and management of residential accommodations.
                  </p>
                  <p>
                    By accessing Guestify through any medium—including but not
                    limited to our website, mobile applications, API interfaces,
                    or third-party integrations—you enter into a legally binding
                    agreement with Guestify and its affiliated entities. This
                    agreement encompasses all services, features, content, and
                    functionality provided through our platform.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                    <p className="text-blue-900 font-medium">
                      <strong>Important:</strong> Your continued use of Guestify
                      constitutes acceptance of these Terms. If you disagree
                      with any provision herein, you must immediately cease all
                      use of our services.
                    </p>
                  </div>
                </Section>

                <Section id="acceptance" title="1. Acceptance of Terms">
                  <p>
                    By creating an account, browsing listings, making bookings,
                    or utilizing any feature of the Guestify platform, you
                    explicitly agree to be bound by these Terms of Service, our
                    Privacy Policy, Community Guidelines, and all applicable
                    laws and regulations.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    1.1 Binding Agreement
                  </h3>
                  <p>
                    These Terms constitute a legally enforceable contract
                    between you (the "User") and Guestify (the "Company", "we",
                    "us", or "our"). This agreement supersedes all prior
                    discussions, negotiations, or agreements related to your use
                    of our services.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    1.2 Modifications and Updates
                  </h3>
                  <p>
                    Guestify reserves the right to modify, amend, or update
                    these Terms at any time to reflect changes in our services,
                    legal requirements, or business practices. We will notify
                    users of material changes through email, platform
                    notifications, or prominent website notices at least 15 days
                    prior to implementation.
                  </p>
                  <p>
                    Your continued use of the platform following the effective
                    date of revised Terms constitutes acceptance. If you do not
                    agree with the modifications, you must discontinue use and
                    may close your account.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    1.3 Eligibility Requirements
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      You must be at least 18 years of age to use Guestify
                    </li>
                    <li>
                      You must have legal capacity to enter into binding
                      contracts
                    </li>
                    <li>
                      You must not be prohibited from using our services under
                      applicable laws
                    </li>
                    <li>
                      You must provide accurate and complete registration
                      information
                    </li>
                  </ul>
                </Section>

                <Section id="use" title="2. Use of Services">
                  <p>
                    Guestify grants you a limited, non-exclusive,
                    non-transferable, revocable license to access and use our
                    platform in accordance with these Terms. This license is
                    conditional upon your compliance with all applicable rules,
                    policies, and legal requirements.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    2.1 Permitted Uses
                  </h3>
                  <p>You may use Guestify for the following lawful purposes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Searching for and booking PG accommodations as a tenant
                    </li>
                    <li>
                      Listing and managing PG properties as a verified owner or
                      authorized agent
                    </li>
                    <li>
                      Communicating with other users through our secure
                      messaging system
                    </li>
                    <li>Accessing customer support and platform resources</li>
                    <li>Managing your account, bookings, and preferences</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    2.2 Prohibited Activities
                  </h3>
                  <p>
                    You expressly agree NOT to engage in any of the following
                    activities:
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                    <ul className="list-disc pl-6 space-y-2 text-red-900">
                      <li>
                        <strong>Identity Fraud:</strong> Misrepresenting your
                        identity, credentials, affiliations, or intentions
                      </li>
                      <li>
                        <strong>False Listings:</strong> Posting fraudulent,
                        misleading, or inaccurate property information
                      </li>
                      <li>
                        <strong>Automated Access:</strong> Using bots, scrapers,
                        crawlers, or automated tools without authorization
                      </li>
                      <li>
                        <strong>Legal Violations:</strong> Violating housing
                        laws, rental regulations, or discrimination statutes
                      </li>
                      <li>
                        <strong>Platform Manipulation:</strong> Attempting to
                        circumvent security measures or access restrictions
                      </li>
                      <li>
                        <strong>Harassment:</strong> Engaging in abusive,
                        threatening, or discriminatory behavior toward other
                        users
                      </li>
                      <li>
                        <strong>Spam and Solicitation:</strong> Sending
                        unsolicited commercial messages or advertisements
                      </li>
                      <li>
                        <strong>Intellectual Property Infringement:</strong>{" "}
                        Copying, redistributing, or reverse-engineering platform
                        content
                      </li>
                      <li>
                        <strong>Off-Platform Transactions:</strong>{" "}
                        Intentionally bypassing Guestify's payment system to
                        avoid fees
                      </li>
                    </ul>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    2.3 Consequences of Misuse
                  </h3>
                  <p>
                    Violation of these usage terms may result in immediate
                    account suspension, permanent termination, legal action, and
                    reporting to relevant authorities. Guestify reserves the
                    right to cooperate with law enforcement in investigating
                    potential criminal activities.
                  </p>
                </Section>

                <Section id="accounts" title="3. User Accounts">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    3.1 Account Registration
                  </h3>
                  <p>
                    To access certain features of Guestify, you must create an
                    account by providing accurate, complete, and current
                    information. You agree to maintain and promptly update your
                    account information to ensure its accuracy throughout your
                    use of the platform.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    3.2 Account Security
                  </h3>
                  <p>
                    You are solely responsible for maintaining the
                    confidentiality and security of your account credentials,
                    including your username, password, and any two-factor
                    authentication methods. You must:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Use a strong, unique password not used for other services
                    </li>
                    <li>Enable two-factor authentication when available</li>
                    <li>Never share your credentials with third parties</li>
                    <li>Log out from shared or public devices</li>
                    <li>
                      Immediately notify Guestify of any unauthorized access or
                      security breaches
                    </li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    3.3 Account Liability
                  </h3>
                  <p>
                    You are fully responsible for all activities conducted
                    through your account, whether authorized or unauthorized.
                    Guestify shall not be liable for any losses, damages, or
                    unauthorized access resulting from your failure to maintain
                    account security. You agree to indemnify Guestify against
                    any claims arising from unauthorized use of your account due
                    to your negligence.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    3.4 Account Termination
                  </h3>
                  <p>
                    You may close your account at any time by following the
                    account closure procedures in your settings. Upon
                    termination, you remain liable for all outstanding
                    obligations, and certain provisions of these Terms
                    (including intellectual property, indemnification, and
                    limitation of liability) shall survive.
                  </p>
                </Section>

                <Section id="listings" title="4. PG Listings and Bookings">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    4.1 Platform Role
                  </h3>
                  <p>
                    Guestify operates strictly as an intermediary platform
                    connecting property owners with potential tenants. We do not
                    own, control, manage, or operate any listed properties.
                    Guestify is not a real estate broker, property manager,
                    landlord, or tenant representative.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    4.2 Property Owner Responsibilities
                  </h3>
                  <p>
                    If you list properties on Guestify, you represent and
                    warrant that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      You have legal authority to rent the property (as owner or
                      authorized agent)
                    </li>
                    <li>
                      All listing information, photos, amenities, and pricing
                      are accurate and current
                    </li>
                    <li>
                      The property complies with all applicable housing, safety,
                      and zoning regulations
                    </li>
                    <li>
                      You possess all necessary permits, licenses, and insurance
                    </li>
                    <li>
                      The property is fit for habitation and free from hazardous
                      conditions
                    </li>
                    <li>
                      You will honor all confirmed bookings made through the
                      platform
                    </li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    4.3 Tenant Responsibilities
                  </h3>
                  <p>
                    If you book accommodations through Guestify, you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate personal and contact information</li>
                    <li>
                      Conduct due diligence by visiting properties before
                      finalizing bookings
                    </li>
                    <li>
                      Comply with property rules, house regulations, and local
                      laws
                    </li>
                    <li>
                      Report any discrepancies between listings and actual
                      conditions
                    </li>
                    <li>Treat properties and other residents with respect</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    4.4 No Guarantees
                  </h3>
                  <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-lg">
                    <p className="text-amber-900">
                      <strong>Disclaimer:</strong> Guestify makes no
                      representations or warranties regarding the quality,
                      safety, suitability, legality, or accuracy of any listed
                      property. Users engage with properties and other users
                      entirely at their own risk. We strongly recommend
                      conducting thorough inspections, verifying documentation,
                      and consulting legal counsel before entering any rental
                      agreements.
                    </p>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    4.5 Dispute Resolution
                  </h3>
                  <p>
                    Disputes between property owners and tenants (including
                    issues related to deposits, damages, cancellations, or
                    property conditions) must be resolved directly between the
                    parties. Guestify may provide mediation assistance but is
                    not obligated to intervene and bears no liability for
                    dispute outcomes.
                  </p>
                </Section>

                <Section id="payments" title="5. Payments and Fees">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    5.1 Transaction Processing
                  </h3>
                  <p>
                    All financial transactions conducted through Guestify must
                    be legitimate, authorized, and comply with applicable
                    payment regulations. We utilize secure third-party payment
                    processors to handle transactions. By making payments
                    through our platform, you agree to the terms and policies of
                    these payment providers.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    5.2 Service Fees and Commissions
                  </h3>
                  <p>Guestify may charge the following fees:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Booking Fees:</strong> A percentage-based fee on
                      confirmed reservations
                    </li>
                    <li>
                      <strong>Listing Fees:</strong> Monthly or annual
                      subscription fees for property owners
                    </li>
                    <li>
                      <strong>Premium Features:</strong> Additional charges for
                      enhanced visibility or features
                    </li>
                    <li>
                      <strong>Transaction Fees:</strong> Processing fees for
                      payment handling
                    </li>
                  </ul>
                  <p className="mt-4">
                    All applicable fees will be clearly disclosed before
                    transaction completion. Fee structures are subject to change
                    with reasonable notice to users.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    5.3 Refund Policy
                  </h3>
                  <p>
                    Service fees, subscription charges, and commissions paid to
                    Guestify are generally non-refundable except in the
                    following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Platform technical errors resulting in duplicate charges
                    </li>
                    <li>
                      Fraudulent listings verified by Guestify investigation
                    </li>
                    <li>Services not delivered due to platform failure</li>
                    <li>As required by applicable consumer protection laws</li>
                  </ul>
                  <p className="mt-4">
                    Refund requests must be submitted within 30 days of the
                    transaction and will be evaluated on a case-by-case basis.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    5.4 Payment Security
                  </h3>
                  <p>
                    While Guestify implements industry-standard security
                    measures, you acknowledge that no electronic transmission is
                    completely secure. You are responsible for ensuring the
                    security of your payment methods and must report any
                    fraudulent activity immediately.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    5.5 Taxation
                  </h3>
                  <p>
                    You are responsible for determining and paying all
                    applicable taxes (including income tax, GST, or other
                    levies) related to your use of Guestify. Property owners
                    must ensure tax compliance for rental income, and Guestify
                    may report transaction information to tax authorities as
                    required by law.
                  </p>
                </Section>

                <Section id="intellectual" title="6. Intellectual Property">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    6.1 Platform Ownership
                  </h3>
                  <p>
                    All content, features, and functionality of the Guestify
                    platform—including but not limited to software code,
                    algorithms, user interfaces, visual designs, logos,
                    trademarks, graphics, text, databases, and documentation—are
                    owned by Guestify or our licensors and are protected by
                    international copyright, trademark, patent, trade secret,
                    and other intellectual property laws.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    6.2 User License
                  </h3>
                  <p>
                    Subject to your compliance with these Terms, Guestify grants
                    you a limited, non-exclusive, non-transferable,
                    non-sublicensable, revocable license to access and use the
                    platform for personal, non-commercial purposes. This license
                    does not include any right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Reproduce, duplicate, copy, or modify platform content
                    </li>
                    <li>Sell, resell, or commercially exploit our services</li>
                    <li>
                      Reverse engineer, decompile, or disassemble our software
                    </li>
                    <li>Create derivative works or competing services</li>
                    <li>Remove copyright notices or proprietary markings</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    6.3 User-Generated Content
                  </h3>
                  <p>
                    When you upload content to Guestify (including property
                    photos, descriptions, reviews, or messages), you retain
                    ownership of your content but grant Guestify a worldwide,
                    perpetual, irrevocable, royalty-free, sublicensable license
                    to use, reproduce, modify, adapt, publish, and distribute
                    such content for platform operation, marketing, and
                    improvement purposes.
                  </p>
                  <p className="mt-4">
                    You represent and warrant that you own or have obtained all
                    necessary rights to any content you submit and that such
                    content does not infringe upon any third-party intellectual
                    property rights.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    6.4 Trademark Policy
                  </h3>
                  <p>
                    The Guestify name, logo, and all related product and service
                    names are trademarks of Guestify. You may not use these
                    marks without prior written permission. Unauthorized use may
                    constitute trademark infringement and violation of
                    applicable laws.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    6.5 Copyright Infringement Claims
                  </h3>
                  <p>
                    If you believe your copyrighted work has been infringed upon
                    on our platform, please submit a notice to our designated
                    copyright agent with the required information under the
                    Digital Millennium Copyright Act (DMCA) or equivalent local
                    laws.
                  </p>
                </Section>

                <Section id="termination" title="7. Termination">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    7.1 Termination by User
                  </h3>
                  <p>
                    You may terminate your account at any time by accessing
                    account settings and following the closure procedure. Upon
                    termination, your access to paid features will cease
                    immediately, though you remain responsible for any
                    outstanding obligations.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    7.2 Termination by Guestify
                  </h3>
                  <p>
                    Guestify reserves the right to suspend, disable, or
                    permanently terminate your account and access to our
                    services, with or without notice, for any of the following
                    reasons:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violation of these Terms of Service or our policies</li>
                    <li>Fraudulent, abusive, or illegal activity</li>
                    <li>Threats to platform security or integrity</li>
                    <li>Non-payment of fees or chargebacks</li>
                    <li>Impersonation or identity fraud</li>
                    <li>Repeated complaints or policy violations</li>
                    <li>Inactivity for extended periods</li>
                    <li>Court orders or legal requirements</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    7.3 Effect of Termination
                  </h3>
                  <p>
                    Upon termination, all licenses and rights granted to you
                    will immediately cease. Guestify may delete your account
                    data subject to legal retention requirements. Provisions
                    regarding intellectual property, limitation of liability,
                    indemnification, and dispute resolution shall survive
                    termination.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    7.4 No Liability
                  </h3>
                  <p>
                    Guestify shall not be liable to you or any third party for
                    termination of your account or access to services. No
                    refunds will be provided for unused subscription periods or
                    services upon termination for cause.
                  </p>
                </Section>

                <Section id="liability" title="8. Limitation of Liability">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    8.1 Disclaimer of Warranties
                  </h3>
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 mb-2">
                      THE GUESTIFY PLATFORM IS PROVIDED "AS IS" AND "AS
                      AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
                    </p>
                    <p className="text-gray-800">
                      To the fullest extent permitted by law, Guestify disclaims
                      all warranties, express or implied, including but not
                      limited to warranties of merchantability, fitness for a
                      particular purpose, non-infringement, accuracy,
                      reliability, or availability. We do not warrant that the
                      platform will be uninterrupted, error-free, or secure.
                    </p>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    8.2 Limitation of Damages
                  </h3>
                  <p>
                    To the maximum extent permitted by applicable law, Guestify
                    and its affiliates, officers, directors, employees, agents,
                    and licensors shall not be liable for any indirect,
                    incidental, consequential, special, punitive, or exemplary
                    damages arising from or related to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your use or inability to use the platform</li>
                    <li>
                      Property conditions, safety issues, or habitability
                      concerns
                    </li>
                    <li>
                      Disputes between users (tenants and property owners)
                    </li>
                    <li>
                      Loss of profits, revenue, data, or business opportunities
                    </li>
                    <li>
                      Personal injury, property damage, or emotional distress
                    </li>
                    <li>
                      Fraudulent listings, misrepresentations, or user
                      misconduct
                    </li>
                    <li>Platform downtime, errors, or data breaches</li>
                    <li>Third-party actions or content</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    8.3 Liability Cap
                  </h3>
                  <p>
                    In no event shall Guestify's total aggregate liability
                    exceed the amount you paid to Guestify in the twelve months
                    preceding the claim, or one hundred US dollars (USD $100),
                    whichever is greater.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    8.4 User Assumption of Risk
                  </h3>
                  <p>
                    You acknowledge and agree that all interactions,
                    transactions, and engagements with other users occur
                    entirely at your own risk. Guestify cannot and does not
                    verify the accuracy of user-provided information, conduct
                    background checks, or guarantee user safety. You are solely
                    responsible for exercising caution, conducting due
                    diligence, and taking appropriate safety precautions.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    8.5 Indemnification
                  </h3>
                  <p>
                    You agree to indemnify, defend, and hold harmless Guestify
                    and its affiliates from any claims, damages, losses,
                    liabilities, and expenses (including legal fees) arising
                    from your violation of these Terms, misuse of the platform,
                    or infringement of third-party rights.
                  </p>
                </Section>

                <Section id="privacy" title="9. Privacy Policy">
                  <p>
                    Your privacy is important to us. The collection, use,
                    storage, and sharing of your personal information are
                    governed by our Privacy Policy, which is incorporated into
                    these Terms by reference.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    9.1 Data Collection
                  </h3>
                  <p>By using Guestify, you consent to our collection of:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Personal information (name, email, phone number, address)
                    </li>
                    <li>
                      Usage data (IP address, browser type, device information)
                    </li>
                    <li>Cookies and tracking technologies</li>
                    <li>Communications and interactions on the platform</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    9.2 Data Usage
                  </h3>
                  <p>
                    We use your data to provide, maintain, and improve our
                    services, communicate with you, personalize your experience,
                    and ensure platform security.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    9.3 Data Sharing
                  </h3>
                  <p>
                    We may share your information with third-party service
                    providers, legal authorities, and as required by law. We do
                    not sell your personal data to advertisers.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    9.4 User Rights
                  </h3>
                  <p>
                    You have rights regarding your personal data, including
                    access, correction, deletion, and objection to processing.
                    Please refer to our Privacy Policy for detailed information.
                  </p>
                </Section>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Helpers ------------------ */

const toc = [
  { id: "introduction", label: "Introduction" },
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "use", label: "Use of Services" },
  { id: "accounts", label: "User Accounts" },
  { id: "listings", label: "PG Listings & Bookings" },
  { id: "payments", label: "Payments & Fees" },
  { id: "intellectual", label: "Intellectual Property" },
  { id: "termination", label: "Termination" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "privacy", label: "Privacy Policy" },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-2xl font-medium text-gray-900 mb-4">{title}</h2>
      <div className="text-gray-600 leading-relaxed text-[15px] space-y-3">
        {children}
      </div>
    </section>
  );
}
