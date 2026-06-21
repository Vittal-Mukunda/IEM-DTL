import type { Metadata } from "next";
import Image from "next/image";
import { labs, hodMessage, professionalSocieties } from "@/lib/data";
import HistoryTimeline from "@/components/about/HistoryTimeline";
import LabImage from "@/components/about/LabImage";

export const metadata: Metadata = {
  title: "About the Department",
  description:
    "Learn about the Department of Industrial Engineering & Management at RVCE — history since 1980, vision, mission, accreditation, labs, and future roadmap.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">About the Department</h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            History, vision, accreditation, labs, and where the department is
            headed.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* HoD Message */}
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
                  className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base"
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

        {/* History — interactive timeline */}
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
            <ol className="space-y-3 text-gray-700 text-sm leading-relaxed list-decimal list-inside">
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
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
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
                <p className="text-sm text-gray-700 leading-relaxed">{pso}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Accreditation */}
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

        {/* Professional Societies */}
        <section className="mb-14">
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

        {/* Labs */}
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

        {/* Future Roadmap */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">
            Future Roadmap
          </h2>
          <ul className="space-y-3">
            {[
              "Instituting industry-sponsored chairs and programs",
              "Total faculty involvement in research, training & consultancy",
              "Establishment of an independent Consultancy Cell",
              "Outreach programs adopting rural areas for inclusive development",
              "Sponsored chairs for social governance & welfare",
              "Achieving global excellence in Industrial and Systems Engineering",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
