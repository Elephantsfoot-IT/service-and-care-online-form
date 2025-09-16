"use client";

import Header from "@/components/header";
import Sider from "@/components/sider";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <title>Service Agreement</title>
      <Header />
      <Sider />
      {/* Push content below fixed header, and to the right of fixed sidebar on xl+ */}
      <main className="pt-[88px] xl:pl-[400px]">
        <div className="px-4 xl:px-20 text-neutral-700 ">{children}</div>
      </main>
      <Toaster />
    </>
  );
}
