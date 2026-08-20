/**
 * UChicago Career Advancement undergraduate sample, transcribed field by field.
 */

import type { ResumeDoc } from "../core/model";

export const uchicagoOriginal: ResumeDoc = {
  version: 1,
  templateId: "uchicago",
  personal: {
    name: "Your Name",
    links: [
      { id: "l1", kind: "email", label: "youremail@uchicago.edu" },
      { id: "l2", kind: "phone", label: "Phone Number" },
      { id: "l3", kind: "location", label: "Address" },
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
          organization: "The University of Chicago",
          location: "Chicago, IL",
          position: "Bachelor of Arts in Psychology",
          dateStart: "expected June 2028",
          bullets: [],
          tags: [],
        },
        {
          id: "e2",
          organization: "Jones High School",
          location: "Chicago, IL",
          position: "Diploma",
          dateStart: "May 2024",
          summary: "3.92/4.00",
          detail: "High Honor Roll (2020-2024), Outstanding Senior Award (2024), Valedictorian (2024)",
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
          organization: "University of Chicago Department of Psychology",
          location: "Chicago, IL",
          position: "Research Assistant",
          dateStart: "October 2024-Present",
          bullets: [
            "Virtually investigate and extract data from academic research to formulate and design experiments that explore career goals and outcomes in executive leadership roles",
            "Collect and examine data from various sources to gather meaningful and measurable evidence about human behavior and the motivation behind philanthropic giving",
          ],
          tags: [],
        },
        {
          id: "x2",
          organization: "Boston Consulting Group",
          location: "Chicago, IL",
          position: "Job Shadow",
          dateStart: "September 2024",
          bullets: [
            "Shadowed a Senior Consultant for 5 days to gain exposure to the consulting industry",
            "Attended Case Team Meetings and gained knowledge on the problem-solving and consulting process",
            "Assessed risk potential and summarized reports on upcoming and ongoing projects for job shadowing host",
          ],
          tags: [],
        },
        {
          id: "x3",
          organization: "Private Family Client",
          location: "Chicago, IL",
          position: "Childcare Provider",
          dateStart: "January 2021-September 2024",
          bullets: [
            "Supervised two children, ages 4 and 7, while parents were away at work during afternoons and evenings",
            "Created a child-friendly environment by monitoring children's activities, overseeing meals and naps, and organizing activities and games to enhance children's physical, emotional, and social well-being",
          ],
          tags: [],
        },
      ],
    },
    {
      id: "s-lead",
      kind: "leadership",
      title: "Leadership & Activities",
      visible: true,
      layout: "entries",
      entries: [
        {
          id: "d1",
          organization: "University of Chicago Model United Nations Team",
          location: "Chicago, IL",
          position: "Delegate",
          dateStart: "September 2024-Present",
          bullets: [
            "Represent UChicago at national Model UN Conferences as part of top-ranked competitive team",
            "Recognized as Best Delegation in GA First Committee at American Model United Nations (AMUN) 2020",
          ],
          tags: [],
        },
        {
          id: "d2",
          organization: "Students Against Destructive Decisions",
          location: "Chicago, IL",
          position: "President",
          dateStart: "August 2022-May 2024",
          bullets: [
            "Led executive board members in coordinating four large campaigns and raising more than $3000",
            "Increased active membership by 30% through innovative membership drive efforts",
            "Served as spokesperson to local community, raising awareness of violence and injury prevention strategies",
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
          organization: "Computer",
          summary: "Proficient in Microsoft Word, PowerPoint, Excel, and Java",
          bullets: [],
          tags: [],
        },
        {
          id: "k2",
          organization: "Language",
          summary: "Proficient in reading and writing Spanish",
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
