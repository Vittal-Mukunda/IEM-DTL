import type { Metadata } from "next";
import {
  researchThemes,
  researchMetrics,
  faculty,
  patents,
  publications,
  fundedProjects,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research at IEM, RVCE — 202 journal articles, h-index 8, 8 research themes spanning OR, supply chain, manufacturing, quality, analytics, and sustainability.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  const researchFaculty = faculty.filter(
    (f) => f.publications && f.publications > 0
  );

  return (
    <>
      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Research</h1>
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

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-14">
          <section className="bg-surface rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-primary mb-4">Vision</h2>
            <blockquote className="text-gray-700 leading-relaxed italic border-l-4 border-accent pl-4">
              &ldquo;Imparting innovation and value based education in Industrial
              Engineering and Management for steering organizations to global
              standards with an emphasis on sustainable and inclusive
              development.&rdquo;
            </blockquote>
          </section>
          <section className="bg-surface rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-primary mb-4">Mission</h2>
            <ol className="space-y-3 text-gray-700 text-base leading-relaxed list-decimal list-inside">
              <li>
                Impart scientific knowledge, engineering and managerial skills
                for driving organizations to global excellence.
              </li>
              <li>
                Promote a culture of training, consultancy, research and
                entrepreneurship interventions among students.
              </li>
              <li>
                Institute collaborative academic and research exchange programs
                with nationally and globally renowned academia, industries and
                organizations.
              </li>
              <li>
                Establish and nurture centres of excellence in niche areas of
                Industrial and Systems Engineering.
              </li>
            </ol>
          </section>
        </div>

        {/* PEOs */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Program Educational Objectives (PEOs)
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Conceive, design, implement and operate integrated systems, focusing on appropriate measures of performance at strategic, tactical and operational levels.",
              "Develop competency to adapt to changing roles for achieving organizational excellence.",
              "Design and develop sustainable technologies and solutions for the betterment of society.",
              "Pursue entrepreneurial ventures with a focus on creativity and innovation for developing newer products, processes and systems.",
            ].map((peo, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm"
              >
                <span className="text-xs font-bold text-accent">
                  PEO {i + 1}
                </span>
                <p className="text-base text-gray-700 mt-2 leading-relaxed">
                  {peo}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PSOs */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Program Specific Outcomes (PSOs)
          </h2>
          <div className="space-y-4">
            {[
              "Design, develop, implement and improve integrated systems that involve people, materials, information, equipment and energy.",
              "Apply statistical methods, simulation tools, optimisation techniques and metaheuristics to analyse systems and support effective decision making.",
              "Understand and demonstrate the engineering aspects of management tasks such as planning, organisation, leadership and control, along with the human element across various sectors of the economy.",
            ].map((pso, i) => (
              <div
                key={i}
                className="flex gap-4 bg-surface rounded-lg p-4 border border-gray-100"
              >
                <span className="text-lg font-bold text-primary shrink-0">
                  PSO{i + 1}
                </span>
                <p className="text-base text-gray-700 leading-relaxed">{pso}</p>
              </div>
            ))}
          </div>
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
              .map((f) => {
                // Prefer Google Scholar; fall back to ResearchGate so faculty
                // without a Scholar profile (e.g. Dr. Ramaa A) still link out.
                const profileUrl = f.scholarUrl ?? f.researchgate;
                const profileLabel = f.scholarUrl
                  ? "Google Scholar profile"
                  : "ResearchGate profile";
                return (
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
                      {profileUrl && (
                        <a
                          href={profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${f.name} — ${profileLabel}`}
                          className="text-xs text-primary-light hover:underline"
                        >
                          Profile →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
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

        {/* Sponsored Projects */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Sponsored Projects &amp; Consultancy
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {fundedProjects.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
              >
                <p className="font-semibold text-primary leading-snug">
                  {p.title}
                </p>
                <p className="text-sm text-text-muted mt-2">{p.faculty}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-600">{p.agency}</span>
                  <span className="font-bold text-accent">{p.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Patents */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">Patents</h2>
          <div className="space-y-3">
            {patents.map((p) => (
              <div
                key={p.title}
                className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-surface p-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-800">{p.title}</p>
                  <p className="text-xs text-text-muted mt-1">{p.inventors}</p>
                  {p.applicationNo && (
                    <p className="text-xs text-text-muted mt-0.5">
                      Application No: {p.applicationNo}
                      {p.date ? ` · ${p.date}` : ""}
                    </p>
                  )}
                </div>
                <span className="shrink-0 self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Publications */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Recent Student–Faculty Publications
          </h2>
          <p className="text-text-muted mb-6 max-w-2xl">
            A selection from 2025–2026, reported in the department&apos;s{" "}
            <a href="/about" className="text-primary hover:underline">
              IDEA newsletters
            </a>
            . Dozens more appear across the editions.
          </p>
          <div className="space-y-3">
            {publications.map((pub) => (
              <div
                key={pub.title}
                className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-medium text-gray-800 leading-snug">
                    {pub.title}
                  </p>
                  {pub.scope && (
                    <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                      {pub.scope}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-2">{pub.authors}</p>
                <p className="text-xs text-primary-light mt-1">{pub.venue}</p>
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
