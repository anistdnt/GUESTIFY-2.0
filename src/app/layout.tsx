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
      <body>
        <AOSProvider>
          {children}
        </AOSProvider>
      </body>
    </html>
  );
}
