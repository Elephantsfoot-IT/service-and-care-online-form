// components/GlobalOverlay.tsx
"use client";

import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function SubmissionLoader({ show }: { show: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when visible
  useEffect(() => {
    if (!show) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [show]);

  if (!mounted || !show) return null;

  return createPortal(
    <div
      role="alert"
      aria-busy="true"
      aria-live="assertive"
      className="
        fixed inset-0 z-[2147483647]   /* effectively 'infinite' */
        flex items-center justify-center flex-col 
        bg-white px-2
      "
    >
      <div className="flex items-center justify-center flex-col fade-up translate-y-[-100px]">
        <img
          src="/service-and-care-loading-logo.gif"
          alt="Loading"
          className="w-20 mb-6"
        />
        <p className="text-2xl text-neutral-800 font-medium">
          {` We’re processing your submission`}
        </p>
        <p className="text-base text-neutral-500">Please stay on this page.</p>
      </div>
    </div>,
    document.body
  );
}
