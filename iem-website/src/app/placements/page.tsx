import type { Metadata } from "next";
import PlacementStory from "@/components/placements/PlacementStory";

export const metadata: Metadata = {
  title: "Placements & Careers",
  description:
    "IEM RVCE placement statistics — ₹21.45 LPA highest package, ₹12.46 LPA average (2024–25), 70%+ placement rate. Recruiters include Airbus, Cisco, Flipkart, Intel, Micron.",
  alternates: { canonical: "/placements" },
};

export default function PlacementsPage() {
  return (
    <>
      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Placements &amp; Careers</h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            70%+ placement rate, ₹21.45 LPA highest package, and 20+ recruiters
            across manufacturing, IT, consulting, and finance.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive data story: KPIs, trend chart, year explorer, recruiters */}
        <div className="mb-14">
          <PlacementStory />
        </div>

        {/* Career Paths */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Career Paths for IEM Graduates
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                area: "Operations & Supply Chain",
                roles:
                  "Operations Analyst, Supply Chain Analyst, Logistics Executive, PPC Engineer, Demand Planner",
              },
              {
                area: "Quality & Process",
                roles:
                  "Quality Engineer, Six Sigma Consultant, Process Improvement Engineer, Manufacturing Engineer",
              },
              {
                area: "Consulting & Analytics",
                roles:
                  "Business Analyst, Management Consultant, Data Analyst, PMO Roles",
              },
              {
                area: "IT & Product",
                roles:
                  "ERP/SAP Consultant, Product Analyst, Systems Analyst",
              },
              {
                area: "Finance",
                roles:
                  "Risk Analyst, Operations Analyst (Banking, Trading Firms)",
              },
              {
                area: "Entrepreneurship",
                roles:
                  "Founder / Co-founder; the program builds entrepreneurial competency",
              },
            ].map((path) => (
              <div
                key={path.area}
                className="bg-surface rounded-xl p-5 border border-gray-100"
              >
                <h3 className="font-semibold text-primary text-sm mb-2">
                  {path.area}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {path.roles}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Higher Education */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">
            Higher Education Pathways
          </h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-primary mb-2">MBA</p>
                <p>
                  Operations, Supply Chain, Analytics, or General Management at
                  IIMs and top B-schools (CAT/GMAT).
                </p>
              </div>
              <div>
                <p className="font-semibold text-primary mb-2">
                  MS / M.Tech
                </p>
                <p>
                  Industrial Engineering, Operations Research, Supply Chain,
                  Engineering Management, Data Science (GRE/GATE).
                </p>
              </div>
              <div>
                <p className="font-semibold text-primary mb-2">PhD</p>
                <p>
                  Including via RVCE&apos;s own VTU-recognized Research Centre.
                </p>
              </div>
              <div>
                <p className="font-semibold text-primary mb-2">
                  Strong Feeder
                </p>
                <p>
                  IEM&apos;s quantitative + management blend makes it ideal for
                  analytics and operations-management graduate programs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
