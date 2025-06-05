import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Findocalc",
  description: "Findocalc - Collection of personal finance calculators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased h-screen bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
