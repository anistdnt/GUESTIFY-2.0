import "../(sharedlayout)/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "@/components/Header/Header";
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/redux/Provider";
import GlobalLoaderWrapper from "@/components/Loader/GlobalLoaderWrapper";
import { metadataMap } from "@/metadata/metadata.config";

export const metadata = metadataMap["login_signup"];

export default function LoginSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <GlobalLoaderWrapper />
      <Header />
      <main>
        <Toaster />
        {children}
      </main>
    </ReduxProvider>
  );
}
