interface Metadata {
  title: string;
  description: string;
  icons?: object;
}

export const metadataMap: Record<string, Metadata> = {
  global: {
    title: "Guestify | Manage Your Paying Guest Properties Seamlessly",
    // Fully Elaborated description for global metadata
    description:
      "Guestify is your all-in-one solution to manage and track your paying guest properties with ease. From bookings to payments, our platform offers comprehensive tools to streamline your property management process. Join Guestify today and take control of your paying guest business like never before.",
    icons: {
      icon: "/favicon.ico",
    }
  },
  bookings: {
    title: "Bookings | Maintain and Track Bookings",
    description: "Manage all your PG bookings in one place",
  },
  dashboard: {
    title: "Admin Dashboard | Overview & Insights of Paying Guest Properties",
    description:
      "Get a comprehensive overview of your paying guest properties, bookings, and earnings.",
  },
  mypg: {
    title: "My PGs | Manage Your Paying Guest Properties",
    description:
      "Easily manage and update your listed paying guest properties.",
  },
  payments: {
    title: "Payments | Track Your Earnings and Transactions",
    description:
      "Monitor all your payment transactions and earnings from your paying guest properties.",
  },
  attraction: {
    title: "Manage your Local Attractions",
    description:
      "Monitor all your payment transactions and earnings from your paying guest properties.",
  },
  pg: {
    title: "Manupulate PG | Add a New Paying Guest Property",
    description:
      "Easily add and list a new paying guest property to your portfolio.",
  },
  profile: {
    title: "My Profile | Manage Your Admin Account",
    description: "Update your personal information and account settings.",
  },
  profile_user: {
    title: "Profile | Manage Account, Bookings & Wishlist",
    description: "View and manage your account details, bookings, and wishlist.",
  },
  login_signup: {
    title: "Login/Signup | Access Your Admin Account",
    description:
      "Log in to your admin account or sign up to manage your paying guest properties.",
  },
  thankyou: {
    title: "Thank You | Booking Confirmation",
    description:
      "Thank you for your booking! Your reservation has been successfully confirmed.",
  },
  about: {
    title: "About Us | Learn More About Guestify",
    description:
      "Discover more about Guestify, our mission, and how we help manage paying guest properties.",
  },
  contact: {
    title: "Contact Us | Get in Touch with Guestify",
    description:
      "Have questions? Reach out to the Guestify team for support and inquiries.",
  },
  terms_and_services: {
    title: "Terms and Services | Guestify",
    description:
      "Read the terms and services for using Guestify's platform and services.",
  },
  explore_pg: {
    title: "Explore PGs | Find Paying Guest Houses in West Bengal",
    description:
      "Browse and discover paying guest houses across various districts in West Bengal.",
  },
  search_pg: {
    title: "Search PGs | Find Your Ideal Paying Guest House",
    description:
      "Search for paying guest houses based on your preferences and requirements.",
  },
};
