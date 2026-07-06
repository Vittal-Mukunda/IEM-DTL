import type { Metadata } from "next";
import CourseExplorer from "@/components/curriculum/CourseExplorer";
import { syllabusDocs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Curriculum & Academics",
  description:
    "B.E. Industrial Engineering & Management curriculum at RVCE — course structure, labs, pedagogy, evaluation, and experiential learning across all 4 years.",
  alternates: { canonical: "/curriculum" },
};

const yearProgression = [
  {
    year: "1st Year",
    focus: "IDEA Lab",
    desc: "Hands-on IoT: sensors, actuators, and connected devices.",
  },
  {
    year: "2nd Year",
    focus: "Design Thinking Lab",
    desc: "Structured ideation, prototyping, and user-centered design.",
  },
  {
    year: "3rd Year",
    focus: "Minor Project",
    desc: "An applied solution to a real industry or research problem.",
  },
  {
    year: "4th Year",
    focus: "Major Project",
    desc: "Full-scale project management, simulation, and research; faculty encourage converting projects into publications.",
  },
];

export default function CurriculumPage() {
  return (
    <>
      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Curriculum &amp; Academics</h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            How the 4-year autonomous B.E. program is structured, taught, and
            assessed.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Knowledge Areas */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Knowledge Areas
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Mechanical Engineering",
              "Industrial Engineering",
              "Operations Research",
              "Supply Chain Management",
              "Quality Management",
              "Finance & Costing",
              "HRM & OB",
              "Information Systems",
              "Statistics & Simulation",
              "Analytics & AI",
              "Digital Supply Chains",
              "Sustainability Engineering",
            ].map((area) => (
              <span
                key={area}
                className="px-4 py-2 bg-primary/5 text-primary rounded-lg text-sm font-medium border border-primary/10"
              >
                {area}
              </span>
            ))}
          </div>
        </section>

        {/* Experiential Progression */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Experiential Learning Progression
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {yearProgression.map((item, i) => (
              <div
                key={item.year}
                className="relative bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-lg flex items-center justify-center mb-3">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-primary">{item.year}</h3>
                <p className="text-sm font-medium text-accent mt-1">
                  {item.focus}
                </p>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Representative Courses */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Representative Courses
          </h2>
          <p className="text-text-muted mb-6 max-w-2xl">
            Filter by knowledge area, then open any course to see what it covers
            and who teaches it.
          </p>
          <CourseExplorer />
          <p className="text-sm text-text-muted mt-4">
            Schemes in force: 2018, 2021, 2022, and 2025 (latest).
          </p>
        </section>

        {/* Scheme & Syllabus Downloads */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Scheme &amp; Syllabus — Downloads
          </h2>
          <p className="text-text-muted mb-6 max-w-2xl">
            Official semester-wise scheme &amp; syllabus booklets (2022 scheme).
            Download the full course structure, credits, and detailed syllabi.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {syllabusDocs.map((doc) => (
              <a
                key={doc.file}
                href={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="shrink-0 w-11 h-11 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-primary text-sm group-hover:text-primary-light transition-colors">
                    {doc.label}
                  </h3>
                  <p className="text-xs text-text-muted mt-1">{doc.scheme}</p>
                  <p className="text-xs text-accent font-medium mt-2">
                    Download ↓ <span className="text-text-muted">· {doc.size}</span>
                  </p>
                </div>
              </a>
            ))}
          </div>
          <p className="text-sm text-text-muted mt-4">
            Also available: the{" "}
            <span className="font-medium text-primary">2025 scheme</span> and
            earlier 2021/2018 schemes from the department office.
          </p>
        </section>

        {/* Evaluation */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Evaluation Structure (2022 Scheme)
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-primary mb-3">
                Theory — CIE (100 marks)
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex justify-between">
                  <span>Two Quizzes</span>
                  <span className="font-medium">20</span>
                </li>
                <li className="flex justify-between">
                  <span>Two Tests (reduced)</span>
                  <span className="font-medium">40</span>
                </li>
                <li className="flex justify-between">
                  <span>Experiential Learning</span>
                  <span className="font-medium">40</span>
                </li>
                <li className="text-xs text-text-muted pl-4">
                  Case Study (10) + Program-specific (10) + Video Seminar (10) +
                  Design/Modeling (10)
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-primary mb-3">
                Lab — CIE (50 marks)
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex justify-between">
                  <span>Exercises / Report</span>
                  <span className="font-medium">20</span>
                </li>
                <li className="flex justify-between">
                  <span>Lab Test</span>
                  <span className="font-medium">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Innovative Experiment</span>
                  <span className="font-medium">20</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pedagogy */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Teaching Innovations
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Think-Pair-Share & Peer Instruction",
              "Flipped Classroom",
              "Problem-Based Learning (PBL)",
              "Integrated Experiential Learning",
              "2 Industry Visits per Semester",
              "Expert Lectures (≥1 per subject/sem)",
              "NPTEL Courses for Credit",
              "CAD/Simulation Software",
              "German University Collaborations",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-surface rounded-lg p-4 border border-gray-100"
              >
                <span className="mt-0.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Internships */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">
            Internship Options
          </h2>
          <div className="bg-surface rounded-xl p-6 border border-gray-100">
            <ul className="space-y-3 text-base text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                In-house at RVCE department (~3 weeks)
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                RVCE Centres of Excellence (~16 CoEs + 6 Centres of Competence)
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                Via Internshala and other platforms
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                Industry / R&D organizations: BEL, DRDO, ISRO, BHEL
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
