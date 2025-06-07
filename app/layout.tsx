import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Zapcalc - Collection of personal finance calculators.",
  description: "Collection of personal finance calculators such as inflation calculator, depreciation calculator, SIP calculator, EMI calculator and much more.",
  icons: {
    icon: "/favicon.svg"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <body
        className={`antialiased h-full w-full`}
      >
        {children}
      </body>
    </html>
  );
}
