interface SiteInfo {
  name: string;
  title: string;
  description: string;
  url: string;
  images: string[];
  fabicon?: string;
}

export const SITE_INFO: SiteInfo = {
    name: "Guestify",
    title: "Guestify | Find the Best PGs & Paying Guest in West Bengal",
    description: "Guestify helps students and working professionals find verified PG and paying guest accommodations across West Bengal. Search, compare, and book rooms easily.",
    url: "https://guestify-2-0.vercel.app/",
    images: ["/assets/new_logo.png"],
    fabicon: "/favicon.ico",
}