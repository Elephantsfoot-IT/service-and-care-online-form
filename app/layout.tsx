import { roboto } from "@/lib/font";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      
      <head>
      <title>Service & Care</title>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/new-emblem.svg"
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
