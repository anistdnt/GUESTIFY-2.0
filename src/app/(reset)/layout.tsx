import GlobalLoaderWrapper from "@/components/Loader/GlobalLoaderWrapper";
import { Toaster } from "react-hot-toast";
import "@/app/(sharedlayout)/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ReduxProvider } from "@/redux/Provider";
import { metadataMap } from "@/metadata/metadata.config";

export const metadata = metadataMap["thankyou"];

export default function ResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <GlobalLoaderWrapper />
      <main>
        <Toaster />
        {children}
      </main>
    </ReduxProvider>
  );
}
