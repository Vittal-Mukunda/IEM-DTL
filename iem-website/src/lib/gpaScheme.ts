// Grading + credit data behind the GPA calculator, taken from the official
// B.E. Industrial Engineering & Management scheme & syllabus booklets:
// semesters III–IV from the 2025 scheme, V–VIII from the 2022 scheme.

// Grade boundaries per course type — [10, 9, 8, 7] grade-point cutoffs on
// total marks (CIE + Lab SEE + Sem End, or the single NPTEL score). Below
// the last cutoff scores 0.
export const COURSE_TYPES = {
  lab: {
    label: "Theory + Lab (300 marks)",
    thresholds: [268, 240, 210, 180],
    hasLab: true,
    scoreOnly: false,
    defaultCredits: 4,
  },
  labHalf: {
    label: "Theory + Lab (200 marks)",
    thresholds: [180, 160, 140, 120],
    hasLab: true,
    scoreOnly: false,
    defaultCredits: 3,
  },
  theory: {
    label: "Theory (200 marks)",
    thresholds: [180, 160, 140, 120],
    hasLab: false,
    scoreOnly: false,
    defaultCredits: 4,
  },
  small: {
    label: "Theory / Lab (100 marks)",
    thresholds: [90, 80, 70, 60],
    hasLab: false,
    scoreOnly: false,
    defaultCredits: 2,
  },
  // NPTEL has no CIE or SEE: the course score out of 100 is the only mark.
  nptel: {
    label: "NPTEL (100 marks)",
    thresholds: [90, 80, 70, 60],
    hasLab: false,
    scoreOnly: true,
    defaultCredits: 2,
  },
} as const;

export type CourseType = keyof typeof COURSE_TYPES;

export interface SchemeCourse {
  code: string;
  name: string;
  type: CourseType;
  credits: number;
}

export interface SemesterScheme {
  sem: number;
  /** roman numeral used on the semester tabs */
  label: string;
  courses: SchemeCourse[];
  /** printed total credits, where the scheme table states one */
  totalCredits?: number;
  /**
   * true when the scheme table carries rows beyond the ones listed here —
   * the calculator tells students to add them manually.
   */
  partial?: boolean;
}

// Course type is derived from the max marks columns of the scheme:
//   Theory + Lab  → CIE 100 + Lab CIE 50 + SEE 100 + Lab SEE 50 = 300
//   Theory + Lab  → CIE 50 + Lab CIE 50 + SEE 50 + Lab SEE 50 = 200 (IM335AI)
//   Theory        → CIE 100 + SEE 100 = 200
//   100-mark      → CIE 50 + SEE 50 (1-credit labs and AE courses)
//   NPTEL         → one course score out of 100, no CIE or SEE
// Projects and the internship are graded 100 CIE + 100 SEE, so they use the
// same 200-mark scale as theory courses. 0-credit audit/bridge courses
// (MAT139BT, CS149BT) do not count towards the SGPA and are left out.
export const semesterSchemes: SemesterScheme[] = [
  {
    sem: 3,
    label: "III",
    totalCredits: 22,
    courses: [
      {
        code: "MA231TB",
        name: "Statistics, Laplace Transform and Numerical Methods",
        type: "theory",
        credits: 4,
      },
      { code: "CV232TA", name: "Environment and Sustainability", type: "theory", credits: 3 },
      { code: "IM233AI", name: "Work Systems Design", type: "lab", credits: 4 },
      {
        code: "IM334AI",
        name: "Manufacturing Processes and Automation",
        type: "lab",
        credits: 4,
      },
      {
        code: "IM335AI",
        name: "Digital Measurements and Metrology",
        type: "labHalf",
        credits: 3,
      },
      {
        code: "IM236AT",
        name: "Human Resource Management and Analytics",
        type: "theory",
        credits: 3,
      },
      { code: "HS238LX", name: "Ability Enhancement Course", type: "small", credits: 1 },
    ],
  },
  {
    sem: 4,
    label: "IV",
    totalCredits: 21,
    courses: [
      {
        code: "IM341AT",
        name: "Probability and Applied Statistics",
        type: "theory",
        credits: 3,
      },
      { code: "ME242TB", name: "Material Science for Engineers", type: "theory", credits: 3 },
      { code: "IM243AI", name: "Principles of Ergonomics", type: "lab", credits: 4 },
      { code: "IM244AI", name: "Operations Research", type: "lab", credits: 4 },
      { code: "IM245AT", name: "Marketing Management", type: "theory", credits: 3 },
      { code: "XX246TAX", name: "Professional Elective", type: "theory", credits: 3 },
      { code: "IM248DL", name: "Applied Design Thinking Lab", type: "small", credits: 1 },
    ],
  },
  {
    sem: 5,
    label: "V",
    totalCredits: 20,
    courses: [
      {
        code: "HS351TA",
        name: "Entrepreneurship and Intellectual Property Rights",
        type: "theory",
        credits: 3,
      },
      { code: "IM352IA", name: "Operations Management", type: "lab", credits: 4 },
      { code: "IM353IA", name: "Quality Assurance", type: "lab", credits: 4 },
      { code: "IM254TA", name: "Finance Accounting and Costing", type: "theory", credits: 4 },
      {
        code: "IM355TBX",
        name: "Professional Core Elective-I (Group B)",
        type: "theory",
        credits: 3,
      },
      { code: "IM256TCX", name: "NPTEL", type: "nptel", credits: 2 },
    ],
  },
  {
    sem: 6,
    label: "VI",
    totalCredits: 24,
    courses: [
      {
        code: "HS261TA",
        name: "Principles of Management and Economics",
        type: "theory",
        credits: 3,
      },
      { code: "IM362IA", name: "Supply Chain Management", type: "lab", credits: 4 },
      { code: "IM363IA", name: "Ergonomics", type: "lab", credits: 4 },
      {
        code: "IM364TA",
        name: "Human Resource Management & Analytics",
        type: "theory",
        credits: 4,
      },
      {
        code: "IM365TDX",
        name: "Professional Core Elective-III (Group D)",
        type: "theory",
        credits: 3,
      },
      {
        code: "XX266TEX",
        name: "Institutional Elective – I (Group E)",
        type: "theory",
        credits: 3,
      },
      { code: "IM367P", name: "Interdisciplinary Project", type: "theory", credits: 3 },
    ],
  },
  {
    sem: 7,
    label: "VII",
    totalCredits: 20,
    courses: [
      { code: "HS271TA", name: "Indian Knowledge System", type: "theory", credits: 3 },
      { code: "IM372IA", name: "Product Design & Development", type: "lab", credits: 4 },
      { code: "IM373TA", name: "Total Quality Management", type: "theory", credits: 4 },
      {
        code: "IM374TFX",
        name: "Professional Core Elective-IV (Group F)",
        type: "theory",
        credits: 3,
      },
      {
        code: "XX375TGX",
        name: "Institutional Elective – II (Group G)",
        type: "theory",
        credits: 3,
      },
      { code: "IM376SI", name: "Summer Internship", type: "theory", credits: 3 },
    ],
  },
  {
    sem: 8,
    label: "VIII",
    totalCredits: 12,
    courses: [{ code: "IM481P", name: "Major Project", type: "theory", credits: 12 }],
  },
];
