import type { Metadata } from "next";
import { SITE_INFO } from ".";

// Global SEO Metadata Defaults
export const SEO_DEFAULTS: Metadata = {
  metadataBase: new URL(SITE_INFO.url),

  title: SITE_INFO.title,
  description: SITE_INFO.description,

  keywords: [
    "Guestify",
    "PG accommodation West Bengal",
    "paying guest Kolkata",
    "PG for students",
    "PG for working professionals",
    "PG near college",
    "PG booking website",
    "PG finder",
    "boys PG Kolkata",
    "girls PG West Bengal",
    "student housing West Bengal",
    "affordable PG Kolkata",
    "shared accommodation",
    "PG rental platform",
    "hostel alternative",
    "PG near IT park",
    "Salt Lake PG",
    "New Town PG",
    "Howrah PG",
    "Durgapur PG",
    "Kharagpur PG",
    "room booking West Bengal",
    "online PG system",
    "PG management software",
    "PG owner portal",
    "tenant accommodation app",
    "PG listing platform",
    "rental housing app",
  ],

  icons: {
    icon: SITE_INFO.fabicon || "/favicon.ico",
  },

  verification: {
    google: "49inOYESHgjCwmk-03BMUdHzy0E7HV3KjDAfuyS3uUg",
  },

  // For Google SEO Robot Crawlers
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Appearence to be shown while sharing the link on Social Media
  openGraph: {
    title: SITE_INFO.title,
    description:
      "Find verified PGs and paying guest accommodations for students and working professionals across West Bengal.",
    url: SITE_INFO.url,
    siteName: SITE_INFO.name,
    images: [
      {
        url: SITE_INFO.images[0],
        width: 1200,
        height: 630,
        alt: "Guestify PG Rental Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  // Appearence to be shown while sharing the link on Twitter
  twitter: {
    card: "summary_large_image",
    title: "Guestify | Smart PG & Paying Guest Platform",
    description:
      "Search, compare, and book verified PG accommodations for students & professionals.",
    images: SITE_INFO.images,
  },

//   alternates: {
//     canonical: "https://guestify.in",
//   },
};;