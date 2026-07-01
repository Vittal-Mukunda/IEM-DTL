import type { Metadata } from "next";
import { Source_Serif_4, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Headings — Source Serif 4: an academic text serif drawn for long-form
// scholarship. Reads as a university / research publication, not a startup.
const heading = Source_Serif_4({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

// Body — Source Sans 3: the purpose-built humanist companion to Source
// Serif. Shared metrics, highly legible at UI sizes.
const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Labels / index numbers — IBM Plex Mono: an engineering-instrument
// register for kickers, section indices, and readouts.
const code = IBM_Plex_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
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
    url: "/",
    siteName: "IEM Department, RVCE",
    title: "Industrial Engineering & Management | RVCE, Bengaluru",
    description:
      "NBA-accredited B.E. program blending engineering with management. 70%+ placements, ₹21.45 LPA highest package.",
  },
  twitter: {
    card: "summary_large_image",
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
      className={`${heading.variable} ${body.variable} ${code.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
