// Grading + credit data behind the GPA calculator, taken from the official
// B.E. Industrial Engineering & Management scheme (semesters III–VII).

// Grade boundaries per course type — [10, 9, 8, 7] grade-point cutoffs on
// total marks (CIE + Lab SEE + Sem End). Below the last cutoff scores 0.
export const COURSE_TYPES = {
  lab: {
    label: "Theory + Lab (300 marks)",
    thresholds: [268, 240, 210, 180],
    hasLab: true,
    defaultCredits: 4,
  },
  theory: {
    label: "Theory (200 marks)",
    thresholds: [180, 160, 140, 120],
    hasLab: false,
    defaultCredits: 4,
  },
  basket: {
    label: "Basket Course (200 marks)",
    thresholds: [179, 161, 141, 121],
    hasLab: false,
    defaultCredits: 3,
  },
  small: {
    label: "Theory / Lab (100 marks)",
    thresholds: [90, 80, 70, 60],
    hasLab: false,
    defaultCredits: 2,
  },
  half: {
    label: "NPTEL, SEE only (50 marks)",
    thresholds: [45, 40, 35, 30],
    hasLab: false,
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
//   Theory        → CIE 100 + SEE 100 = 200
//   100-mark      → CIE 50 + SEE 50 (2-credit theory, labs, NPTEL in IV sem)
//   50-mark       → SEE 50 only (V sem NPTEL elective)
// Projects and the internship are graded 100 CIE + 100 SEE, so they use the
// same 200-mark scale as theory courses.
export const semesterSchemes: SemesterScheme[] = [
  {
    sem: 3,
    label: "III",
    partial: true,
    courses: [
      {
        code: "MAT231TB",
        name: "Statistics, Laplace Transform and Numerical Methods",
        type: "theory",
        credits: 4,
      },
      { code: "XX232TX", name: "Basket Course – Group A", type: "basket", credits: 3 },
      { code: "IM233AI", name: "Work Systems Design", type: "lab", credits: 4 },
      { code: "IM234AI", name: "Manufacturing Processes", type: "lab", credits: 4 },
      { code: "IM235AI", name: "Digital Metrology", type: "lab", credits: 4 },
      {
        code: "HS237LX",
        name: "Ability Enhancement Course – Group C",
        type: "small",
        credits: 2,
      },
    ],
  },
  {
    sem: 4,
    label: "IV",
    partial: true,
    courses: [
      { code: "IM241AT", name: "Statistics for Data Analytics", type: "theory", credits: 3 },
      { code: "XX242TX", name: "Basket Course – Group A", type: "basket", credits: 3 },
      { code: "IM343AI", name: "CAD/CAM & Robotics", type: "lab", credits: 4 },
      { code: "IM244AI", name: "Operations Research", type: "lab", credits: 4 },
      { code: "IM345AT", name: "Marketing Management", type: "theory", credits: 3 },
      {
        code: "XX246TX",
        name: "Professional Core Course I – Group B (NPTEL)",
        type: "small",
        credits: 2,
      },
      { code: "IM247DL", name: "Design Thinking Lab", type: "small", credits: 2 },
      { code: "HS248AT", name: "Universal Human Values", type: "small", credits: 2 },
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
      {
        code: "IM256TCX",
        name: "Professional Core Elective-II (Group C, NPTEL)",
        type: "half",
        credits: 2,
      },
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
];
