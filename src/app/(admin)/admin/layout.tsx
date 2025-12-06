"use client";

import GlobalLoaderWrapper from "@/components/Loader/GlobalLoaderWrapper";
import { Toaster } from "react-hot-toast";
import "@/app/(sharedlayout)/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ReduxProvider } from "@/redux/Provider";
import DefaultModal from "@/components/Modals/DefaultModal";
import AdminLayoutComponent from "@/components/Header/admin/AdminLayoutComponent";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <ReduxProvider>
          <GlobalLoaderWrapper />
          <DefaultModal />
          <main className="">
            <Toaster />

            <AdminLayoutComponent>
                {children}
            </AdminLayoutComponent>
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
