"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next/client";
import Image from "next/image";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const user_id = searchParams.get("user_id");
    const is_admin = searchParams.get("is_admin");

    if (!token || !user_id) {
      setStatus("error");
      setErrorMsg("Invalid authentication response. Missing credentials.");
      return;
    }

    // Store token in cookie (2 hour expiry)
    setCookie("authToken", token, { maxAge: 2 * 60 * 60 });

    const isAdmin = is_admin === "true";

    // Brief delay for the UI animation before redirect
    const timer = setTimeout(() => {
      setStatus("success");
      const redirectTo = isAdmin ? `/admin/${user_id}/dashboard` : "/";
      router.replace(redirectTo);
    }, 1800);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] font-jakarta relative overflow-hidden">
      {/* Background Gradient Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-200/30 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Card */}
      <div className="relative z-10 flex flex-col items-center gap-8 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.07)] border border-white/60 p-14 max-w-sm w-full mx-4">
        {/* Logo */}
        <Image
          src="/assets/new_logo.png"
          alt="Guestify Logo"
          width={160}
          height={60}
          className="h-10 w-auto"
          priority
        />

        {status === "loading" && (
          <>
            {/* Spinner */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
              {/* Google G icon inside */}
              <div className="absolute inset-0 flex items-center justify-center">
                <GoogleIcon size={28} />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900 font-display tracking-tight">
                Signing you in<DotFlicker />
              </h1>
              <p className="text-gray-400 text-sm">
                Completing your Google authentication
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full animate-progress" />
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-100">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900 font-display">Authenticated!</h1>
              <p className="text-gray-400 text-sm">Redirecting to your dashboard…</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-100">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900 font-display">Authentication Failed</h1>
              <p className="text-gray-400 text-sm">{errorMsg}</p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-colors text-sm"
            >
              Back to Login
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-8 text-xs text-gray-300">
        © {new Date().getFullYear()} Guestify. Secure OAuth 2.0
      </p>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.6s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

/* Animated ellipsis */
function DotFlicker() {
  return (
    <span className="inline-flex gap-[2px] ml-0.5 align-bottom">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-[5px] h-[5px] rounded-full bg-primary-600"
          style={{
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

/* Google Brand Icon */
function GoogleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
