import type { Metadata } from "next";
import { Kalam, Patrick_Hand } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Headings — thick felt-tip marker
// Only ever rendered bold (every .font-display use forces weight 700),
// so we ship a single weight instead of two.
const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

// Body — legible handwriting
const patrickHand = Patrick_Hand({
  variable: "--font-patrick",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iem-rvce.vercel.app"),
  title: {
    default:
      "Industrial Engineering & Management | RVCE, Bengaluru",
    template: "%s | IEM, RVCE",
  },
  description:
    "Department of Industrial Engineering & Management at R.V. College of Engineering (RVCE), Bengaluru. NBA-accredited B.E. program blending engineering with management. 70%+ placements, ₹21.45 LPA highest package.",
  keywords: [
    "Industrial Engineering and Management",
    "RVCE",
    "IEM RVCE",
    "R.V. College of Engineering",
    "Bengaluru",
    "NBA accredited",
    "industrial engineering degree",
    "operations research",
    "supply chain management",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "IEM Department, RVCE",
    title: "Industrial Engineering & Management | RVCE, Bengaluru",
    description:
      "NBA-accredited B.E. program blending engineering with management. 70%+ placements, ₹21.45 LPA highest package.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${kalam.variable} ${patrickHand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
