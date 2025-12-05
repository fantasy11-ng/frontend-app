import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fantasy11 | Play, Predict & Win Big!",
  description:
    "Fantasy11 is the ultimate fantasy sports platform for football fans. Create teams, join contests, track live scores and compete for prizes.",
  keywords: [
    "Fantasy11",
    "fantasy football",
    "sports prediction",
    "fantasy sports Nigeria",
    "football games",
    "AFCON fantasy",
    "Premier League fantasy",
  ],
  authors: [{ name: "Fantasy11" }],
  robots: "index, follow",
  openGraph: {
    title: "Fantasy11 | Play, Predict & Win Big!",
    description:
      "Join Fantasy11 and experience the most exciting fantasy football platform. Create teams, join contests, and climb the leaderboard.",
    images: [{ url: "https://fantasy11.com/og-image.png" }],
    url: "https://fantasy11.com",
    siteName: "Fantasy11",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fantasy11 | Play, Predict & Win Big!",
    description:
      "Create fantasy football teams, join contests, and win prizes on Fantasy11!",
    images: ["https://fantasy11.com/og-image.png"],
    creator: "@Fantasy11",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#ff0000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
