/**
 * "What's new" log for the study-material section.
 *
 * ONE ENTRY PER UPLOAD BATCH, newest first. Whenever you push new papers or
 * notes, add an entry at the TOP of `studyUpdates` listing what was added.
 * It feeds the "Latest additions" panel on /resources/study-material and the
 * full history at /resources/updates.
 *
 * `href` is either the PDF itself (/notes/...) or, for sets of many files, the
 * study-material page. A test (updates.test.ts) fails if an /notes/ link points
 * at a file that doesn't exist, or if entries are out of order.
 */

export type UpdateKind =
  | "Question paper"
  | "Notes"
  | "Slides"
  | "Question bank";

export interface UpdateItem {
  /** Semester the material belongs to (3-8). */
  sem: number;
  /** Subject the material belongs to, e.g. "Operations Management". */
  course: string;
  /** What was added, e.g. "CIE 2 paper (16 Nov 2026)". */
  title: string;
  kind: UpdateKind;
  /** PDF under /notes/, or an internal page for multi-file sets. */
  href: string;
  /** Optional hint where to find it inside the PDF. */
  note?: string;
}

export interface StudyUpdate {
  /** ISO date of the upload, YYYY-MM-DD. */
  date: string;
  /** One line describing the batch. */
  summary: string;
  /** Optional small acknowledgement of whoever contributed the batch. */
  credit?: string;
  items: UpdateItem[];
}

const SEM5_CIE2 = "/notes/sem5/question-papers/cie-2-by-subject.pdf";
const SEM5_ELECTIVE_CIE2 = "/notes/sem5/electives/cie-2-by-subject.pdf";
const OM = "/notes/sem5/operations-management";
const EIS = "/notes/sem5/enterprise-information-systems";
const FAC = "/notes/sem5/finance-accounting-and-costing";
const STUDY_PAGE = "/resources/study-material";
const SEM3_CIE2 = "/notes/sem3/question-papers/cie-2.pdf";
const SEM3_ELECTIVE_CIE2 = "/notes/sem3/electives/cie-2.pdf";

export const studyUpdates: StudyUpdate[] = [
  {
    date: "2026-11-21",
    summary: "Entrepreneurship & IPR master notes",
    credit: "Notes sent by Pranjal",
    items: [
      {
        sem: 5,
        course: "Entrepreneurship & Intellectual Property Rights",
        title: "Master notes, all units",
        kind: "Notes",
        href: "/notes/sem5/entrepreneurship-and-ipr/master-notes-all-units.pdf",
        note: "Full slide deck covering every unit (506 pages, large file)",
      },
    ],
  },
  {
    date: "2026-11-20",
    summary: "Six Sem 3 CIE 2 papers (Nov 2026)",
    credit: "Papers contributed by Umar Arshad Ahamed",
    items: [
      {
        sem: 3,
        course: "Mathematics III",
        title: "CIE 2 paper (16 Nov 2026)",
        kind: "Question paper",
        href: SEM3_CIE2,
        note: "First paper in the file",
      },
      {
        sem: 3,
        course: "Work Systems Design",
        title: "CIE 2 paper (17 Nov 2026)",
        kind: "Question paper",
        href: SEM3_CIE2,
        note: "First paper under Work Systems Design",
      },
      {
        sem: 3,
        course: "Manufacturing Process & Automation",
        title: "CIE 2 paper (17 Nov 2026)",
        kind: "Question paper",
        href: SEM3_CIE2,
        note: "First paper under Manufacturing Process",
      },
      {
        sem: 3,
        course: "Digital Measurements & Metrology",
        title: "CIE 2 paper (18 Nov 2026)",
        kind: "Question paper",
        href: SEM3_CIE2,
        note: "First paper under Digital Metrology",
      },
      {
        sem: 3,
        course: "Human Resource Management & Analytics",
        title: "CIE 2 paper (18 Nov 2026)",
        kind: "Question paper",
        href: SEM3_CIE2,
        note: "Last paper in the file",
      },
      {
        sem: 3,
        course: "Environment & Sustainability (elective)",
        title: "CIE 2 paper (16 Nov 2026)",
        kind: "Question paper",
        href: SEM3_ELECTIVE_CIE2,
        note: "First paper in the file",
      },
    ],
  },
  {
    date: "2026-11-19",
    summary: "Three more Sem 5 CIE 2 papers",
    items: [
      {
        sem: 5,
        course: "Finance, Accounting & Costing",
        title: "CIE 2 paper (17 Nov 2026)",
        kind: "Question paper",
        href: SEM5_CIE2,
        note: "First paper under Finance, Accounting & Costing",
      },
      {
        sem: 5,
        course: "Quality Assurance",
        title: "CIE 2 paper (17 Nov 2026)",
        kind: "Question paper",
        href: SEM5_CIE2,
        note: "First paper under Quality Assurance",
      },
      {
        sem: 5,
        course: "Enterprise Information Systems",
        title: "CIE 2 paper (18 Nov 2026)",
        kind: "Question paper",
        href: SEM5_ELECTIVE_CIE2,
        note: "First paper in the Electives CIE 2 PDF",
      },
    ],
  },
  {
    date: "2026-11-17",
    summary: "Sem 5 CIE 2 papers begin",
    items: [
      {
        sem: 5,
        course: "Operations Management",
        title: "CIE 2 paper (16 Nov 2026)",
        kind: "Question paper",
        href: SEM5_CIE2,
        note: "First paper under Operations Management",
      },
      {
        sem: 5,
        course: "Entrepreneurship & IPR",
        title: "CIE 2 paper (16 Nov 2026)",
        kind: "Question paper",
        href: SEM5_CIE2,
        note: "First paper in the PDF",
      },
    ],
  },
  {
    date: "2026-11-15",
    summary: "Sem 3 Work Systems Design handwritten notes",
    items: [
      {
        sem: 3,
        course: "Work Systems Design",
        title: "Handwritten notes, Units 1 to 5 (11 PDFs)",
        kind: "Notes",
        href: STUDY_PAGE,
        note: "Open Sem 3, then Work Systems Design",
      },
    ],
  },
  {
    date: "2026-11-13",
    summary: "Operations Management slide decks, Units 2 to 5",
    items: [
      {
        sem: 5,
        course: "Operations Management",
        title: "Unit 2: Capacity Planning slides",
        kind: "Slides",
        href: `${OM}/unit-2-slides-capacity-planning.pdf`,
      },
      {
        sem: 5,
        course: "Operations Management",
        title: "Unit 3: Forecasting slides",
        kind: "Slides",
        href: `${OM}/unit-3-slides-forecasting.pdf`,
      },
      {
        sem: 5,
        course: "Operations Management",
        title: "Unit 4: Constraint Management slides",
        kind: "Slides",
        href: `${OM}/unit-4-slides-constraint-management.pdf`,
      },
      {
        sem: 5,
        course: "Operations Management",
        title: "Unit 4: Resource Planning slides",
        kind: "Slides",
        href: `${OM}/unit-4-slides-resource-planning.pdf`,
      },
      {
        sem: 5,
        course: "Operations Management",
        title: "Unit 5: Operations Planning and Scheduling slides",
        kind: "Slides",
        href: `${OM}/unit-5-slides-operations-planning-and-scheduling.pdf`,
      },
    ],
  },
  {
    date: "2026-11-09",
    summary: "Enterprise Information Systems Unit 2 notes",
    items: [
      {
        sem: 5,
        course: "Enterprise Information Systems",
        title: "Unit 2: Automation, RPA and data for decision making",
        kind: "Notes",
        href: `${EIS}/unit-2-automation-rpa-data-for-decision-making-and-data-analytics.pdf`,
      },
      {
        sem: 5,
        course: "Enterprise Information Systems",
        title: "Unit 2: Business Process Reengineering and best practices (Ch. 5)",
        kind: "Notes",
        href: `${EIS}/unit-2-chapter-5-business-process-reengineering-and-best-practices.pdf`,
      },
      {
        sem: 5,
        course: "Enterprise Information Systems",
        title: "Unit 2: Business Intelligence Systems and EIS (Ch. 10)",
        kind: "Notes",
        href: `${EIS}/unit-2-chapter-10-business-intelligence-systems-and-eis.pdf`,
      },
    ],
  },
  {
    date: "2026-11-08",
    summary: "Finance, Accounting & Costing Units 4 and 5",
    items: [
      {
        sem: 5,
        course: "Finance, Accounting & Costing",
        title: "Unit 4: Costing elements, job and process costing",
        kind: "Notes",
        href: `${FAC}/unit-4-costing-elements-job-and-process-costing.pdf`,
      },
      {
        sem: 5,
        course: "Finance, Accounting & Costing",
        title: "Unit 5: Standard costing and variances",
        kind: "Notes",
        href: `${FAC}/unit-5-standard-costing-and-variances.pdf`,
      },
    ],
  },
  {
    date: "2026-11-07",
    summary: "Finance Unit 2 expanded; new Sem 3 Manufacturing Processes units",
    items: [
      {
        sem: 5,
        course: "Finance, Accounting & Costing",
        title:
          "Unit 2 notes extended: single vs double entry, bank reconciliation, trial balance",
        kind: "Notes",
        href: `${FAC}/unit-2-accounting-process-journal-ledger-cash-book.pdf`,
      },
      {
        sem: 3,
        course: "Manufacturing Processes",
        title: "Unit 4: Introduction to Automation",
        kind: "Slides",
        href: "/notes/sem3/manufacturing-processes/unit-4-introduction-to-automation.pdf",
      },
      {
        sem: 3,
        course: "Manufacturing Processes",
        title: "Unit 5: Robotics",
        kind: "Slides",
        href: "/notes/sem3/manufacturing-processes/unit-5-robotics.pdf",
      },
    ],
  },
  {
    date: "2026-10-25",
    summary: "Finance CIE 1 paper",
    items: [
      {
        sem: 5,
        course: "Finance, Accounting & Costing",
        title: "CIE 1 paper (Oct 2026)",
        kind: "Question paper",
        href: "/notes/sem5/question-papers/cie-1-by-subject.pdf",
        note: "First paper under Finance, Accounting & Costing",
      },
    ],
  },
  {
    date: "2026-10-20",
    summary: "Sem 3 CIE 1 papers",
    items: [
      {
        sem: 3,
        course: "Maths, Work Systems Design, Manufacturing, Metrology, HRM and Environment",
        title: "Seven CIE 1 papers (Oct 2026)",
        kind: "Question paper",
        href: "/notes/sem3/question-papers/cie-1.pdf",
        note: "Newest paper first under each course",
      },
    ],
  },
];
