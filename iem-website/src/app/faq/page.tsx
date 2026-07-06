import type { Metadata } from "next";
import { faqs } from "@/lib/data";
import { jsonLdScript } from "@/lib/jsonLd";
import FAQAccordion from "@/components/faq/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ — Industrial Engineering & Management",
  description:
    "Frequently asked questions about B.E. Industrial Engineering & Management at RVCE — placements, curriculum, careers, eligibility, and more.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }}
      />

      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            Direct answers on placements, curriculum, eligibility, and careers
            in IEM at RVCE.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <FAQAccordion faqs={faqs} />

        {/* Myths vs Reality */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Myth vs Reality
          </h2>
          <div className="space-y-4">
            {[
              {
                myth: "IEM is just an easy/management branch, not real engineering.",
                reality:
                  "It's a core-plus-management hybrid demanding statistics, operations research, optimization and systems modeling. Comparable rigor, different focus.",
              },
              {
                myth: "IEM has no scope / no jobs.",
                reality:
                  "Industrial engineers are hired across manufacturing, logistics, IT, consulting, BFSI and analytics, with thousands of openings in India.",
              },
              {
                myth: "IEM ≈ Mechanical-lite.",
                reality:
                  "IEM adds supply chain, quality, finance, HR, IS and decision science on top of engineering fundamentals, which widens the career options.",
              },
              {
                myth: "Placements are poor.",
                reality:
                  "Official: >70% over 3 years with strong recruiters. Many also choose higher studies by choice.",
              },
              {
                myth: "You can only do factory jobs.",
                reality:
                  "Graduates work in consulting, analytics, product, finance and entrepreneurship, not only shop-floor roles.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-surface rounded-xl p-5 border border-gray-100"
              >
                <p className="text-base font-semibold text-red-600 mb-2">
                  Myth: &ldquo;{item.myth}&rdquo;
                </p>
                <p className="text-base text-gray-700">
                  <span className="font-semibold text-green-700">
                    Reality:
                  </span>{" "}
                  {item.reality}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
