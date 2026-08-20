/**
 * The Harvard OCS sample, transcribed field by field.
 *
 * This is the fixture the verifier diffs against `original.pdf`. It exists to
 * answer one question: given the same words, does the engine put them in the
 * same places as the document we are replicating?
 */

import type { ResumeDoc } from "../core/model";

export const harvardOriginal: ResumeDoc = {
  version: 1,
  templateId: "harvard",
  personal: {
    name: "Firstname Lastname",
    links: [
      { id: "l1", kind: "location", label: "17 Main Street" },
      { id: "l2", kind: "other", label: "Los Angeles, CA 92720" },
      { id: "l3", kind: "email", label: "youremail@college.harvard.edu" },
      { id: "l4", kind: "phone", label: "(714) 558-9857" },
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
          organization: "Harvard University",
          location: "Cambridge, MA",
          position: "A.B. Honors degree in History. GPA 3.73.",
          dateStart: "May 2027",
          detail:
            "Relevant Coursework: International Political Economics and the European Community.",
          bullets: ["Commit 25 hours per week to Harvard Varsity Field Hockey Program."],
          tags: [],
        },
        {
          id: "e2",
          organization: "University of London",
          location: "London, UK",
          position: "Study abroad coursework in European History and Econometrics.",
          dateStart: "May",
          dateEnd: "August 2025",
          bullets: [],
          tags: [],
        },
        {
          id: "e3",
          organization: "Los Angeles High School",
          location: "Los Angeles, CA",
          position: "Graduated with high honors.  SAT I: M:780 V:760.",
          dateStart: "June 2023",
          detail: "National Honor Society. Member of Varsity Field Hockey Team.",
          bullets: [],
          tags: [],
        },
      ],
    },
    {
      id: "s-exp",
      kind: "experience",
      title: "Experience",
      visible: true,
      layout: "entries",
      entries: [
        {
          id: "x1",
          organization: "Pepsi-Cola North America Beverages",
          location: "Remote",
          position: "Marketing Analyst Intern",
          dateStart: "May",
          dateEnd: "August 2026",
          bullets: [
            "Examined profitability of foreign market for new fruit drink using analysis of comparable brands. Managed focus groups and consumer surveys gathering over 500 data points. Created ideas for niche marketing campaigns including use of social networks and viral marketing. Presented findings to senior managers using quantitative analysis and creative visuals in combined PowerPoint presentation.",
          ],
          tags: [],
        },
        {
          id: "x2",
          organization: "Thomas Wilck Associates",
          location: "London, UK",
          position: "Assistant Account Executive",
          dateStart: "May",
          dateEnd: "August 2025",
          bullets: [
            "Researched and assembled requests for proposals for medium-sized public relations and communications firm. Actively participated in staff meetings and brainstorming sessions. Generated correspondence with top executive officers.",
          ],
          tags: [],
        },
        {
          id: "x3",
          organization: "Tech Hills",
          location: "Laguna Hills, CA",
          position: "Technology Intern",
          dateStart: "May",
          dateEnd: "August 2024",
          bullets: [
            "Implemented new web site, including back end database storage system and dynamic web pages.",
          ],
          tags: [],
        },
      ],
    },
    {
      id: "s-lead",
      kind: "leadership",
      title: "Leadership",
      visible: true,
      layout: "entries",
      entries: [
        {
          id: "d1",
          organization: "Harvard Undergraduate Women in Business (WIB)",
          location: "Cambridge, MA",
          position: "Executive Committee Member",
          dateStart: "February 2024",
          current: true,
          bullets: [
            "Organized marketing and advertising campaign to increase membership. Coordinated business conference and networking reception for 50 business professionals and 500 students.",
          ],
          tags: [],
        },
        {
          id: "d2",
          organization: "Harvard College Marathon Challenge",
          location: "Cambridge, MA",
          position: "Training Program Director",
          dateStart: "January",
          dateEnd: "May 2024",
          bullets: [
            "Developed training program for 25 charity runners. Raised over $25,000 to support Phillips Brooks House Association and The Cambridge Food Project.",
          ],
          tags: [],
        },
      ],
    },
    {
      id: "s-skills",
      kind: "skills",
      title: "Skills & Interests",
      visible: true,
      layout: "labeled",
      entries: [
        {
          id: "k1",
          organization: "Technical",
          summary: "Stata, SQL, R (intermediate), SPSS (beginner).",
          bullets: [],
          tags: [],
        },
        {
          id: "k2",
          organization: "Language",
          summary: "Fluent French and Conversational Spanish.",
          bullets: [],
          tags: [],
        },
        {
          id: "k3",
          organization: "Interests",
          summary: "Ultimate Frisbee, Bhangra dance, and French films.",
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
