import { Suspense } from "react";
import OAuthCallbackPage from "@/components/Page/User/OAuthCallbackPage"; // move your component to a separate file

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OAuthCallbackPage />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}