import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import GoogleAnalytics from "./google-analytic";
import MicrosoftClarity from "./microsoft-clarity";
import { HandleOnComplete } from "@/lib/router-events";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: "Karntarad",
  description:
    "Karntarad is a gamified platform where users create, manage, and challenge themselves with social marketing scenarios."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <HandleOnComplete />
          <GoogleAnalytics />
          <MicrosoftClarity />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
