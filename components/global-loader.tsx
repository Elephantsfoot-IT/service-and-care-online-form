// components/GlobalOverlay.tsx
"use client";

import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function GlobalOverlay({ show }: { show: boolean }) {
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
        flex items-center justify-center flex-col gap-2
        bg-white
      "
    >
      <div className="translate-y-[-100px]">
        <Loader2Icon className="size-20 animate-spin text-efg-yellow mb-2" />
      </div>
    </div>,
    document.body
  );
}
