import type { Metadata, Viewport } from "next";
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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bunexdiv.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "bunexdiv | URL shortener for long URLs",
    template: "%s | bunexdiv",
  },
  description:
    "bunexdiv helps you shorten long URLs into clean, shareable links for social media, marketing, and everyday sharing.",
  applicationName: "bunexdiv",
  keywords: [
    "URL shortener",
    "shorten links",
    "link shortener",
    "custom short links",
    "shareable links",
    "URL shortening tool",
    "bunexdiv",
  ],
  authors: [{ name: "bunexdiv" }],
  creator: "bunexdiv",
  publisher: "bunexdiv",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "bunexdiv | Shorten URLs instantly",
    description:
      "Create cleaner, shorten links for sharing online with bunexdiv.",
    url: siteUrl,
    siteName: "bunexdiv",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "bunexdiv | Shorten URLs instantly",
    description:
      "Shorten long links into cleaner, shareable URLs with bunexdiv.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ea5e9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
