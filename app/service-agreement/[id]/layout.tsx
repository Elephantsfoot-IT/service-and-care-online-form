"use client";

import QueryProvider from "@/lib/query-provider";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <title>Service Agreement</title>
      <QueryProvider>
        <div className="bg-white min-h-screen">
        {children}
        </div>
        </QueryProvider>
      <Toaster />
    </>
  );
}
