/**
 * Princeton CCD Early College sample (Tori Tiger), transcribed field by field.
 */

import type { ResumeDoc } from "../core/model";

export const princetonOriginal: ResumeDoc = {
  version: 1,
  templateId: "princeton",
  personal: {
    name: "Tori Tiger",
    links: [
      { id: "l1", kind: "phone", label: "123.456.5432" },
      { id: "l2", kind: "email", label: "tori.tiger@princeton.edu" },
    ],
  },
  sections: [
    {
      id: "s-edu",
      kind: "education",
      title: "Education",
      visible: true,
      layout: "entries",
      entries: [
        {
          id: "e1",
          organization: "Princeton University",
          location: "Princeton NJ",
          position: "A.B. Candidate; Intended concentration: Sociology",
          dateStart: "Expected May 2026",
          detail:
            "Inequality, Mobility, and the American Dream; Sociology of Sports; American Society and Politics; Self and Society",
          bullets: [],
          tags: [],
        },
        {
          id: "e2",
          organization: "Big Public High School",
          location: "Denver, CO",
          dateStart: "June 2022",
          summary: "National AP Scholar, Class Treasurer",
          bullets: [],
          tags: [],
        },
      ],
    },
    {
      id: "s-exp",
      kind: "experience",
      title: "Work Experience",
      visible: true,
      layout: "entries",
      entries: [
        {
          id: "x1",
          organization: "Firestone Library, Princeton University",
          position: "Student Assistant",
          dateStart: "September 2022-Present",
          bullets: [
            "Build relationships with students and other patrons at busy Circulation desk",
            "Redesigned website using Dreamweaver, increasing visits to page by 15% over 3 months",
          ],
          tags: [],
        },
        {
          id: "x2",
          organization: "The Clothing Company, Littleton, CO",
          position: "Retail Associate",
          dateStart: "May 2021-August 2022",
          bullets: [
            "Recommended products to customers, generating an average of $1,200 in sales",
            "Recognized by management for creating attractive displays that draw attention to new products",
            "Trained 5 new employees on effective sales techniques and mastering product knowledge during fast-paced summer and holiday hours",
          ],
          tags: [],
        },
      ],
    },
    {
      id: "s-lead",
      kind: "leadership",
      title: "Leadership and Service",
      visible: true,
      layout: "entries",
      entries: [
        {
          id: "d1",
          organization: "Princeton University Orchestra",
          position: "Clarinet",
          dateStart: "September 2022-Present",
          bullets: [
            "Rehearse 10 hours per week and perform at 3 recitals each year",
            "Collaborate with music historian to suggest pieces for future concerts",
          ],
          tags: [],
        },
        {
          id: "d2",
          organization: "Local Community Newspaper",
          position: "Contributor",
          dateStart: "August 2020-June 2022",
          bullets: [
            "Interviewed 100+ students to capture balanced and fair stories across 5 public schools",
            "Submitted monthly articles highlighting local students’ academic, athletic, and artistic achievements",
          ],
          tags: [],
        },
        {
          id: "d3",
          organization: "Girl Scouts of the USA",
          position: "Gold Award",
          dateStart: "October 2019",
          bullets: [
            "Hosted a “College & Career Night” for 200 students from 3 area underserved communities",
            "Recruited 20 professionals and marketed event to hundreds of middle and high school students",
          ],
          tags: [],
        },
      ],
    },
    {
      id: "s-skills",
      kind: "skills",
      title: "Skills",
      visible: true,
      layout: "labeled",
      entries: [
        {
          id: "k1",
          organization: "Language",
          summary: "French (4 years) and Spanish (6 years)",
          bullets: [],
          tags: [],
        },
        {
          id: "k2",
          organization: "Office Applications",
          summary: "Word (Advanced), Excel (Proficient), PowerPoint (Intermediate)",
          bullets: [],
          tags: [],
        },
        {
          id: "k3",
          organization: "Graphic Design",
          summary: "Dreamweaver (Advanced), Photoshop (Novice)",
          bullets: [],
          tags: [],
        },
      ],
    },
  ],
  options: {
    fontScale: 1,
    lineSpacing: 1,
    pageSize: "native",
    showIcons: false,
    maxPages: 1,
  },
};
