// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Geek Logistics | East Africa's Smart Freight Network",
  description: "Connecting cargo owners with verified truck drivers across Tanzania, Kenya, Uganda, and Rwanda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-indigo-500/30`}>
        {children}
      </body>
    </html>
  );
}