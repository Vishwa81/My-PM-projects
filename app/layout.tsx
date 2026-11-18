import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ludhiana Bistro – Customer Reviews | Zamato Lite",
  description:
    "Explore authentic reviews and ratings for Ludhiana Bistro on Zamato Lite. Real diners, verified feedback, and honest food ratings.",
  keywords: [
    "Ludhiana Bistro",
    "Zamato Lite",
    "Restaurant Reviews",
    "Punjabi Food",
    "North Indian Cuisine",
    "Ludhiana Restaurants",
  ],
  openGraph: {
    title: "Ludhiana Bistro – Customer Reviews | Zamato Lite",
    description:
      "Explore authentic reviews and ratings for Ludhiana Bistro on Zamato Lite.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-full font-sans antialiased bg-[#F8F8F8] text-[#202124]">
        {children}
      </body>
    </html>
  );
}
