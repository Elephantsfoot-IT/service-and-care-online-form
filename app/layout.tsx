import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { roboto } from "@/lib/font";



export const metadata: Metadata = {
  title: "EFG Service and Care",
  description: "Service and Care Online Form",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/ef-service-care-logomark.svg"
        />
      </head>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
