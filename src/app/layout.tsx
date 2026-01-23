import AOSProvider from "@/components/Wrapper/AOSProvider";
import { SEO_DEFAULTS } from "@/metadata/metadata.seo";
import type { Metadata } from "next";

export const metadata: Metadata = SEO_DEFAULTS;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Guestify",
              alternateName: "Guestify PG & Paying Guest Platform",
              url: "https://guestify-2-0.vercel.app/",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://guestify-2-0.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Guestify",
              url: "https://guestify-2-0.vercel.app/",
              logo: "https://guestify-2-0.vercel.app/logo.png",
              sameAs: [
                "https://www.instagram.com/guestify",
                "https://www.facebook.com/guestify",
              ],
            }),
          }}
        />
      </head>
      <body>
        <AOSProvider>
          {children}
        </AOSProvider>
      </body>
    </html>
  );
}
