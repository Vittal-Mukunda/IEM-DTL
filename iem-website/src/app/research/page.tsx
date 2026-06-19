import type { Metadata } from "next";
import { researchThemes, researchMetrics, faculty } from "@/lib/data";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research at IEM, RVCE — 202 journal articles, h-index 8, 8 research themes spanning OR, supply chain, manufacturing, quality, analytics, and sustainability.",
};

export default function ResearchPage() {
  const researchFaculty = faculty.filter(
    (f) => f.publications && f.publications > 0
  );

  return (
    <>
      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Research</h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            A VTU-recognized Research Centre publishing across 8 thematic
            areas.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Metrics */}
        <section className="mb-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                label: "Journal Articles",
                value: researchMetrics.journalArticles,
              },
              {
                label: "Books / Chapters",
                value: researchMetrics.booksChapters,
              },
              {
                label: "Other Publications",
                value: researchMetrics.otherPublications,
              },
              {
                label: "Scopus Citations",
                value: researchMetrics.scopusCitations,
              },
              { label: "h-index", value: researchMetrics.hIndex },
            ].map((m) => (
              <div
                key={m.label}
                className="bg-primary/5 rounded-xl p-5 text-center border border-primary/10"
              >
                <p className="text-3xl font-bold text-primary">{m.value}</p>
                <p className="text-sm text-text-muted mt-1">{m.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-3">
            Source: RVCE IRINS Research Portal, June 2026
          </p>
        </section>

        {/* Research Themes */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Research Themes
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {researchThemes.map((theme, i) => (
              <div
                key={theme}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-primary/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent font-bold text-sm flex items-center justify-center mb-3">
                  {i + 1}
                </div>
                <p className="text-sm font-medium text-gray-800">{theme}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Faculty Research */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Faculty Research Profiles
          </h2>
          <div className="space-y-3">
            {researchFaculty
              .sort((a, b) => (b.publications ?? 0) - (a.publications ?? 0))
              .map((f) => (
                <div
                  key={f.email}
                  className="flex items-center justify-between bg-surface rounded-lg px-5 py-3 border border-gray-100"
                >
                  <div>
                    <p className="font-medium text-primary text-sm">
                      {f.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {f.specialization}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">
                      {f.publications}
                    </span>
                    <span className="text-xs text-text-muted">pubs</span>
                    {f.scholarUrl && (
                      <a
                        href={f.scholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-light hover:underline"
                      >
                        Profile →
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <p className="text-xs text-text-muted mt-3">
            IRINS shows 8 of 14 faculty with linked profiles. Additional
            publications via Google Scholar / ResearchGate.
          </p>
        </section>

        {/* Research Structure */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Research Infrastructure
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "VTU Research Centre",
              "Research Scholars Program",
              "Centre of Excellence (CoE)",
              "Centre of Competence (CoC)",
              "Collaboration & Networking",
              "Sponsored Projects",
              "Consultancy & Training",
              "Publications Portal (IRINS)",
            ].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm text-sm font-medium text-gray-700"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Conferences */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">
            Conferences &amp; Events
          </h2>
          <div className="bg-surface rounded-xl p-6 border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              The department has conducted approximately{" "}
              <strong>70 conferences and seminars</strong> in areas including
              Industrial Engineering, Supply Chain Management, Lean
              Manufacturing, Rapid Prototyping, Simulation & Modeling, and
              Business Process Modeling. Several were sponsored by{" "}
              <strong>AICTE, ISTE, and industry partners</strong>.
            </p>
            <p className="text-sm text-text-muted mt-3">
              Collaborations with 4 German universities and access to RVCE&apos;s
              16+ Centres of Excellence.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
