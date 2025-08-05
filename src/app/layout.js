import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from '@/components/QueryProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Beyond UI - Blog Platform",
  description: "Explore insights on UI/UX design, SaaS solutions, and digital transformation",
  keywords: "UI design, UX design, SaaS, digital transformation, business efficiency",
  authors: [{ name: "Beyond UI Team" }],
  openGraph: {
    title: "Beyond UI - Blog Platform",
    description: "Explore insights on UI/UX design, SaaS solutions, and digital transformation",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyond UI - Blog Platform",
    description: "Explore insights on UI/UX design, SaaS solutions, and digital transformation",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
