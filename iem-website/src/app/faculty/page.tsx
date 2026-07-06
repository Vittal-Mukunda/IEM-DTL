import type { Metadata } from "next";
import FacultyDirectory from "@/components/faculty/FacultyDirectory";

export const metadata: Metadata = {
  title: "Faculty",
  description:
    "Meet the 14 faculty members of the IEM Department at RVCE — professors, researchers, and mentors in industrial engineering, supply chain, quality, and management. Click any name for full bio and qualifications.",
  alternates: { canonical: "/faculty" },
};

export default function FacultyPage() {
  return (
    <>
      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Faculty</h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            The 14 academics who teach the courses, supervise the research, and
            shape the department.{" "}
            <span className="text-gray-300">
              Click any name or photo for their full bio and qualifications.
            </span>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <FacultyDirectory />
      </div>
    </>
  );
}
