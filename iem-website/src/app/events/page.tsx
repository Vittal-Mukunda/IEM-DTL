import type { Metadata } from "next";
import { events, professionalSocieties } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events & Activities",
  description:
    "Events, seminars, workshops, and student activities at the IEM Department, RVCE — IDEA association, industry visits, expert lectures, and conferences.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <>
      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Events &amp; Activities</h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            Conferences, workshops, industry visits, and the IDEA student
            association.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* IDEA Association */}
        <section className="mb-14">
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-accent/20">
            <h2 className="text-2xl font-bold text-primary mb-3">
              IDEA — InDustrial Engineering Association
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              IDEA is the official department student association, driving
              curricular, co-curricular, and extra-curricular activities. It
              fosters holistic development through events, workshops, guest
              lectures, and inter-college competitions.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/idearvce/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary font-medium hover:text-primary-light transition-colors"
              >
                IDEA on Facebook →
              </a>
              <a
                href="https://in.linkedin.com/in/industrial-engineering-and-management-rv-college-of-engineering-358538299"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary font-medium hover:text-primary-light transition-colors"
              >
                IEM on LinkedIn →
              </a>
            </div>
          </div>
        </section>

        {/* Conference Track Record */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Conference &amp; Seminar Track Record
          </h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <p className="text-4xl font-bold text-primary mb-2">~70</p>
            <p className="text-text-muted mb-4">
              conferences and seminars conducted to date
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Industrial Engineering",
                "Supply Chain Management",
                "Lean Manufacturing",
                "Rapid Prototyping",
                "Simulation & Modeling",
                "Business Process Modeling",
              ].map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1.5 bg-primary/5 text-primary text-xs rounded-full font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
            <p className="text-sm text-text-muted mt-4">
              Several sponsored by AICTE, ISTE, and industry partners.
            </p>
          </div>
        </section>

        {/* Upcoming & Recent Events */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Upcoming &amp; Recent Events
          </h2>
          <div className="space-y-4">
            {events.map((ev) => (
              <div
                key={ev.title}
                className="bg-surface rounded-xl p-5 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-lg px-3 py-2 text-center shrink-0 w-20">
                    <p className="text-lg font-bold leading-tight">{ev.day}</p>
                    <p className="text-xs">{ev.monthYear}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-primary">{ev.title}</h3>
                      {ev.upcoming && (
                        <span className="text-xs bg-accent/15 text-accent font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <p className="text-base text-text-muted mt-1">{ev.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-text-muted mt-4">
            Full event archive available from the department. Check the{" "}
            <a
              href="https://www.facebook.com/idearvce/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              IDEA Facebook page
            </a>{" "}
            for latest updates.
          </p>
        </section>

        {/* Regular Activities */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Regular Activities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Industry Visits",
                desc: "2 per semester, with hands-on exposure to manufacturing, logistics, and service operations.",
                freq: "Every semester",
              },
              {
                title: "Expert Lectures",
                desc: "At least 1 per subject per semester, delivered by industry leaders and domain experts.",
                freq: "Ongoing",
              },
              {
                title: "Webinars",
                desc: "Operations Management, Operations Research, Big Data Analytics, SQL sessions with industry professionals.",
                freq: "Regular",
              },
              {
                title: "NPTEL Courses",
                desc: "Online IIT/IISc courses taken for credit alongside classroom learning.",
                freq: "Every semester",
              },
              {
                title: "Hackathons & Tech Fests",
                desc: "Students participate in innovation competitions, coding challenges, and startup events.",
                freq: "Annual",
              },
              {
                title: "German University Exchange",
                desc: "Collaborations with 4 German universities for academic and research exchange.",
                freq: "Ongoing",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
              >
                <h3 className="font-semibold text-primary mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-accent font-medium mb-2">
                  {item.freq}
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Student Chapters */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">
            Student Chapters &amp; Societies
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "IDEA", desc: "InDustrial Engineering Association" },
              { name: "IIE", desc: "Institute of Industrial Engineers" },
              { name: "E-Cell", desc: "Entrepreneurship Cell, RVCE" },
              { name: "IEEE / ACM", desc: "Institute-wide tech chapters" },
            ].map((ch) => (
              <div
                key={ch.name}
                className="bg-primary/5 rounded-lg p-4 text-center border border-primary/10"
              >
                <p className="font-bold text-primary text-lg">{ch.name}</p>
                <p className="text-xs text-text-muted mt-1">{ch.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Societies */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Professional Society Affiliations
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-3xl">
            The department maintains active links with national professional
            bodies, giving students access to industry networks, certifications,
            and conferences.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {professionalSocieties.map((s) => (
              <div
                key={s.abbr}
                className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm"
              >
                <p className="font-bold text-primary text-lg">{s.abbr}</p>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {s.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
