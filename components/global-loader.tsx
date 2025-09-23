// components/GlobalOverlay.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2Icon } from "lucide-react";

export default function GlobalOverlay({
  show,
}: {
  show: boolean;
}) {
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
        flex items-center justify-center
        bg-white
      "
    >
      <div className="card ">
   
       <img src="/ef-service-care-logomark.svg" alt="Elephants Foot Logo" className="face font" />
       <img src="/ef-service-care-logomark.svg" alt="Elephants Foot Logo" className="face back" />
      </div>
    </div>,
    document.body
  );
}
