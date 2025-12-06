interface Metadata {
  title: string;
  description: string;
}

export const metadataMap: Record<string, Metadata> = {
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
  pg: {
    title: "Manupulate PG | Add a New Paying Guest Property",
    description:
      "Easily add and list a new paying guest property to your portfolio.",
  },
  profile: {
    title: "My Profile | Manage Your Admin Account",
    description: "Update your personal information and account settings.",
  },
};
