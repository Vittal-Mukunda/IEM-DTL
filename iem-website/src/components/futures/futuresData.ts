// ──────────────────────────────────────────────────────────────────
//  "One Degree. Infinite Futures." — narrative data for /futures.
//  The six ecosystems mirror `curriculumDomains` in data.ts (same ids
//  and colors) but are framed as CAREER worlds, not syllabus topics.
//  Ordered to the brief: Ops → Supply Chain → Quality → Design &
//  Manufacturing → Management & HR → Finance & Marketing.
// ──────────────────────────────────────────────────────────────────

export type MotifId =
  | "ops"
  | "scm"
  | "quality"
  | "design"
  | "mgmt"
  | "finance";

export interface Ecosystem {
  id: MotifId;
  /** scene number shown in the corner index */
  no: string;
  label: string;
  /** glow color — matches curriculumDomains in data.ts */
  color: string;
  /** the problem this world solves — one line, present tense */
  problem: string;
  /** the work performed — a short verb phrase */
  work: string;
  /** industries that hire for it */
  industries: string[];
  /** careers this world opens */
  careers: string[];
}

export const ecosystems: Ecosystem[] = [
  {
    id: "ops",
    no: "01",
    label: "Operations & Analytics",
    color: "#3b82f6",
    problem: "Turn data into decisions, and decisions into the optimum.",
    work: "Model systems, forecast demand, find the best move.",
    industries: ["Tech", "E-commerce", "Consulting", "Banking"],
    careers: [
      "Operations Analyst",
      "Business Analyst",
      "Data Analyst",
      "Operations Manager",
      "Decision Scientist",
    ],
  },
  {
    id: "scm",
    no: "02",
    label: "Supply Chain",
    color: "#14b8a6",
    problem: "Move the right thing to the right place, just in time.",
    work: "Design networks, plan flow, cut the lead time.",
    industries: ["Manufacturing", "Retail", "Logistics", "FMCG"],
    careers: [
      "Supply Chain Engineer",
      "Logistics Manager",
      "Demand Planner",
      "Procurement Lead",
      "Industry 4.0 Specialist",
    ],
  },
  {
    id: "quality",
    no: "03",
    label: "Quality",
    color: "#ff4d4d",
    problem: "Engineer out the defect. Make excellence repeatable.",
    work: "Measure, control, and tighten every process.",
    industries: ["Automotive", "Aerospace", "Pharma", "Electronics"],
    careers: [
      "Quality Engineer",
      "Six Sigma Black Belt",
      "Reliability Engineer",
      "Process Excellence Lead",
    ],
  },
  {
    id: "design",
    no: "04",
    label: "Design & Manufacturing",
    color: "#8b5cf6",
    problem: "From CAD to the factory floor — build it, then build it smart.",
    work: "Design products, automate lines, run the plant.",
    industries: ["Automotive", "Aerospace", "Robotics", "Consumer goods"],
    careers: [
      "Manufacturing Engineer",
      "Factory Automation Engineer",
      "Product Designer",
      "CAD / CAM Engineer",
    ],
  },
  {
    id: "mgmt",
    no: "05",
    label: "Management & HR",
    color: "#f59e0b",
    problem: "Lead the people and the plan. Ship it on time.",
    work: "Organize teams, sequence work, deliver projects.",
    industries: ["Consulting", "Startups", "MNCs", "Any industry"],
    careers: [
      "Project Manager",
      "Product Manager",
      "Operations Manager",
      "People & HR Lead",
      "Management Consultant",
    ],
  },
  {
    id: "finance",
    no: "06",
    label: "Finance & Marketing",
    color: "#22c55e",
    problem: "Read the market. Make the numbers work.",
    work: "Price, position, and grow the business.",
    industries: ["Banking", "Consulting", "Startups", "FMCG"],
    careers: [
      "Business Analyst",
      "Product Manager",
      "Financial Analyst",
      "Consultant",
      "Entrepreneur",
    ],
  },
];

// The full career sky for the convergence — the union of every world,
// plus the cross-cutting roles an IEM degree increasingly leads to.
export const careerConstellation: string[] = [
  "Operations Analyst",
  "Business Analyst",
  "Data Analyst",
  "Operations Manager",
  "Supply Chain Engineer",
  "Logistics Manager",
  "Demand Planner",
  "Quality Engineer",
  "Six Sigma Black Belt",
  "Reliability Engineer",
  "Manufacturing Engineer",
  "Factory Automation Engineer",
  "Product Designer",
  "Project Manager",
  "Product Manager",
  "Consultant",
  "Entrepreneur",
  "Financial Analyst",
  "Industry 4.0 Specialist",
  "Digital Transformation Consultant",
];

// Where graduates land — a small, real sample (mirrors data.ts recruiters).
export const futureEmployers = [
  "Airbus",
  "Cisco",
  "Flipkart",
  "Intel",
  "Micron",
  "Titan",
  "Accenture",
  "GE",
];
