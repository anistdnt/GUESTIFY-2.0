import GlobalLoaderWrapper from "@/components/Loader/GlobalLoaderWrapper";
import { Toaster } from "react-hot-toast";
import "@/app/(sharedlayout)/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ReduxProvider } from "@/redux/Provider";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <ReduxProvider>
          <GlobalLoaderWrapper />
          <main className="">
            <Toaster />
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
