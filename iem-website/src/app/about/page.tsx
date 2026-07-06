import type { Metadata } from "next";
import Image from "next/image";
import {
  labs,
  hodMessage,
  professionalSocieties,
  studentAchievements,
  newsletters,
  alumniSpeaks,
  notableAlumni,
} from "@/lib/data";
import HistoryTimeline from "@/components/about/HistoryTimeline";
import LabImage from "@/components/about/LabImage";
import NewsletterViewer from "@/components/about/NewsletterViewer";
import StudentAchievements from "@/components/about/StudentAchievements";

export const metadata: Metadata = {
  title: "About the Department",
  description:
    "About the Department of Industrial Engineering & Management at RVCE — HoD message, history since 1980, newsletters, alumni, labs, student achievements, and accreditation.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">About the Department</h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            History, newsletters, alumni, labs, student achievements, and
            accreditation.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* 1 — HoD Message */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Message from the Head of Department
          </h2>
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-primary/10 flex flex-col md:flex-row gap-6">
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="w-40 aspect-[340/438] rounded-xl overflow-hidden border-2 border-accent/30">
                <Image
                  src={hodMessage.photo}
                  alt={hodMessage.name}
                  width={340}
                  height={438}
                  sizes="160px"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div>
              {hodMessage.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-gray-700 leading-relaxed mb-3 text-base"
                >
                  {p}
                </p>
              ))}
              <p className="font-bold text-primary mt-2">{hodMessage.name}</p>
              <p className="text-sm text-accent">{hodMessage.title}</p>
              <p className="text-xs text-text-muted mt-1">
                {hodMessage.credentials}
              </p>
            </div>
          </div>
        </section>

        {/* 2 — History (interactive timeline) */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-2">
            History &amp; Evolution
          </h2>
          <p className="text-text-muted mb-6 max-w-2xl">
            Six decades from a new college to an autonomous, NBA-accredited
            department. Step through the milestones.
          </p>
          <HistoryTimeline />
        </section>

        {/* 3 — Newsletter */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-2">Newsletter</h2>
          <p className="text-text-muted mb-6 max-w-2xl">
            Department newsletters — read each edition inline, right here on the
            page.
          </p>
          <NewsletterViewer items={newsletters} />
        </section>

        {/* 4 — Alumni Speak */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-2">Alumni Speak</h2>
          <p className="text-text-muted mb-6 max-w-2xl">
            Our graduates lead across product, operations, supply chain,
            analytics and entrepreneurship worldwide. In their words, from the
            department&apos;s newsletter:
          </p>
          <div className="grid gap-4 lg:grid-cols-3">
            {alumniSpeaks.map((a) => (
              <figure
                key={a.name}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <svg
                  className="h-8 w-8 text-accent/50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6.83H5.6A3.6 3.6 0 019.17 8V6H7.17zm10 0A5.17 5.17 0 0012 11.17V18h6.83v-6.83H15.6A3.6 3.6 0 0119.17 8V6h-2z" />
                </svg>
                <blockquote className="mt-3 flex-1 text-base leading-relaxed text-gray-700">
                  {a.quote}
                </blockquote>
                <figcaption className="mt-5 border-t border-gray-100 pt-4">
                  <p className="font-semibold text-primary">{a.name}</p>
                  <p className="text-sm text-accent">{a.role}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    IEM · {a.batch}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-gray-100 bg-surface p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
              Alumni who give back
            </h3>
            <p className="text-sm text-text-muted mb-4 max-w-3xl">
              Graduates regularly return to mentor students, judge final-year
              projects, and open industry doors:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {notableAlumni.map((a) => (
                <div
                  key={a.name}
                  className="rounded-lg border border-gray-100 bg-white p-4"
                >
                  <p className="font-semibold text-primary text-sm">
                    {a.name}
                    {a.batch && (
                      <span className="font-normal text-text-muted">
                        {" "}
                        · {a.batch}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-text-muted mt-1">{a.role}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-text-muted mt-4">
            Are you an IEM alumnus?{" "}
            <a
              href="https://in.linkedin.com/school/rvcengineering/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Connect with us on LinkedIn
            </a>
            .
          </p>
        </section>

        {/* 5 — Labs */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Laboratories &amp; Facilities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {labs.map((lab) => (
              <div
                key={lab.name}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
              >
                {lab.photo && (
                  <LabImage
                    src={lab.photo}
                    alt={lab.name}
                    className="w-full h-40 object-cover bg-gray-100"
                  />
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-primary mb-2">{lab.name}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {lab.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-text-muted mt-4">
            Plus 4 Hi-Tech classrooms with LCD projectors.
          </p>
        </section>

        {/* 6 — Student Achievements (grouped into categories) */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Student Achievements
          </h2>
          <p className="text-text-muted mb-8 max-w-2xl">
            Grouped by area — academics, research, technical work, competitions,
            sport, culture and community.
          </p>
          <StudentAchievements achievements={studentAchievements} />
        </section>

        {/* 7 — Accreditation & Affiliations */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Accreditation &amp; Affiliations
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "NBA Accredited", desc: "UG program in IEM" },
              { label: "VTU Autonomous", desc: "Autonomous status since 2007" },
              { label: "VTU Research Centre", desc: "Ph.D. program" },
              { label: "AICTE Approved", desc: "Centre of Excellence (TEQIP)" },
              { label: "NAAC A+", desc: "Institutional grade (RVCE)" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-primary/5 rounded-lg p-4 text-center border border-primary/10"
              >
                <p className="font-semibold text-primary">{item.label}</p>
                <p className="text-xs text-text-muted mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8 — Professional Societies */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">
            Professional Society Associations
          </h2>
          <div className="flex flex-wrap gap-3">
            {professionalSocieties.map((s) => (
              <span
                key={s.abbr}
                title={s.name}
                className="px-4 py-2 bg-accent/10 text-primary font-medium rounded-full text-sm border border-accent/20"
              >
                {s.abbr}
              </span>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
