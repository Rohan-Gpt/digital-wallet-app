import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppBar } from "@repo/ui/appBar";
import { Providers } from "./provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistSans.variable}`}>
        <AppBar user={"true"} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
