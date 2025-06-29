import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/redux/Provider";
import GlobalLoaderWrapper from "@/components/Loader/GlobalLoaderWrapper";
import DefaultModal from "@/components/Modals/DefaultModal";
// import { API } from "@/lib/api_const";
// import { api_caller } from "@/lib/api_caller";
// import {GetNotification_Type} from "@/components/Header/Header"
// import {ApiReturn} from "@/lib/api_caller"
export const metadata: Metadata = {
  title: "Guestify",
  description: "Generated by create next app",
};

// const notification_response : ApiReturn<GetNotification_Type>= await api_caller<GetNotification_Type>("GET" , API.NOTIFICATION.ALL_NOTIFICATIONS)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className="">
        <ReduxProvider>
          <DefaultModal/>
          <GlobalLoaderWrapper/>
          <Header/>
          <main className="px-4">
            <Toaster />
            {children}
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
