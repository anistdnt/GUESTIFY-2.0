import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/redux/Provider";
import GlobalLoaderWrapper from "@/components/Loader/GlobalLoaderWrapper";
import DefaultModal from "@/components/Modals/DefaultModal";
import { metadataMap } from "@/metadata/metadata.config";
import ChatBot from "@/components/Chatbot/ChatBot";
import Script from "next/script";
import { Inter, Outfit, Instrument_Serif } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
  weight: ["400"],
});

export const metadata = metadataMap["global"];

const MAPMYINDIA_LICENSE_KEY =
  process.env.NEXT_PUBLIC_MAPMYINDIA_LICENSE_KEY;

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} ${outfit.variable} ${instrument.variable} font-sans`}>
      {/* MapMyIndia script — safe & correct in App Router */}
      <Script
        src={`https://apis.mapmyindia.com/advancedmaps/v1/${MAPMYINDIA_LICENSE_KEY}/map_load?v=1.3`}
        strategy="beforeInteractive"
      />

      <ReduxProvider>
        <DefaultModal />
        <GlobalLoaderWrapper />
        <Header />
        <main>
          <Toaster />
          {children}
          <ChatBot />
        </main>
        <Footer />
      </ReduxProvider>
    </div>
  );
}
