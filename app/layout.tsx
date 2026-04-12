import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroller from "@/components/SmoothScroller";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  title: "Flow of Data - Portfolio",
  description: "High-end Data Analyst Portfolio",
  metadataBase: new URL(siteUrl),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 5,
  userScalable: true,
  // Ensure proper safe area handling for notched devices
  themeColor: "#0B0B0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Prevent zoom on iOS when input is focused */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=5, user-scalable=yes" />
        {/* Disable dark mode suggestions that might conflict with design */}
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="font-sans min-h-full flex flex-col bg-charcoal overflow-x-hidden">
        <div className="mathematical-grid"></div>
        <SmoothScroller>
          <main className="relative z-10 mix-blend-screen flex-1 w-full">
            {children}
          </main>
        </SmoothScroller>
      </body>
    </html>
  );
}
