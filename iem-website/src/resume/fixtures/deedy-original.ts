/**
 * Deedy-Resume OpenFonts sample, transcribed from the compiled original.
 *
 * The Links / Coursework / Publications sections of the sample are stored as
 * `custom` (or publications) so they land in the same columns the PDF has;
 * `column` is set explicitly rather than relying on sideKinds, because
 * coursework is not a first-class kind.
 */

import type { ResumeDoc } from "../core/model";

export const deedyOriginal: ResumeDoc = {
  version: 1,
  templateId: "deedy",
  personal: {
    name: "Debarghya Das",
    // The original hard-wraps contact into two centred lines. The engine
    // flows every link as one paragraph, so the first line is stored as the
    // headline (the same slot a student's tagline uses) and the second as
    // links. The pipe on line 1 has no leading space, matching the PDF.
    headline: "debarghyadas.com| fb.co/dd",
    links: [
      { id: "l3", kind: "email", label: "deedy@fb.com" },
      { id: "l4", kind: "phone", label: "607.379.5733" },
      { id: "l5", kind: "email", label: "dd367@cornell.edu" },
    ],
  },
  sections: [
    {
      id: "s-edu",
      kind: "education",
      title: "Education",
      visible: true,
      layout: "entries",
      column: "side",
      entries: [
        {
          id: "e1",
          organization: "Cornell University",
          position: "MEng in Computer Science",
          location: "Ithaca, NY",
          dateStart: "Dec 2014",
          bullets: [],
          tags: [],
        },
        {
          id: "e2",
          organization: "Cornell University",
          position: "BS in Computer Science",
          location: "Ithaca, NY",
          dateStart: "May 2014",
          summary: "College of Engineering",
          bullets: ["Magna Cum Laude", "Major GPA: 3.9 / 4.0"],
          detail: "Cum. GPA: 3.83 / 4.0",
          tags: [],
        },
        {
          id: "e3",
          organization: "La Martiniere for Boys",
          location: "Kolkata, India",
          dateStart: "Grad. May 2011",
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
      column: "main",
      // The original's Google/Phabricator bullets wrap to more lines than EB
      // Lato produces at this column width. This gap restores the RESEARCH
      // heading to its measured baseline (427.35) rather than pretending the
      // wraps match.
      spacingAfter: 34,
      entries: [
        {
          id: "x1",
          organization: "Facebook",
          position: "Software Engineer",
          location: "New York, NY",
          dateStart: "Jan 2015",
          current: true,
          bullets: [],
          tags: [],
        },
        {
          id: "x2",
          organization: "Coursera",
          position: "KPCB Fellow + Software Engineering Intern",
          location: "Mountain View, CA",
          dateStart: "June 2014",
          dateEnd: "Sep 2014",
          bullets: [
            "52 out of 2500 applicants chosen to be a KPCB Fellow 2014.",
            "Led and shipped Yoda - the admin interface for the new Phoenix platform.",
            "Full-stack developer - Wrote and reviewed code for JS using Backbone, Jade, Stylus and Require and Scala using Play",
          ],
          tags: [],
        },
        {
          id: "x3",
          organization: "Google",
          position: "Software Engineering Intern",
          location: "Mountain View, CA",
          dateStart: "May 2013",
          dateEnd: "Aug 2013",
          bullets: [
            "Worked on the YouTube Captions team, in Javascript and Python to plan, to design and develop the full stack to add and edit Automatic Speech Recognition captions. In production.",
            "Created a backbone.js-like framework for the Captions editor.",
          ],
          tags: [],
        },
        {
          id: "x4",
          organization: "Phabricator",
          position: "Open Source Contributor & Team Leader",
          location: "Palo Alto, CA & Ithaca, NY",
          dateStart: "Jan 2013",
          dateEnd: "May 2013",
          bullets: [
            "Phabricator is used daily by Facebook, Dropbox, Quora, Asana and more.",
            "I created the Meme generator and more in PHP and Shell.",
            "Led a team from MIT, Cornell, IC London and UHelsinki for the project.",
          ],
          tags: [],
        },
      ],
    },
    {
      id: "s-links",
      kind: "interests",
      title: "Links",
      visible: true,
      layout: "labeled",
      column: "side",
      spacingAfter: 8,
      entries: [
        { id: "n1", organization: "Facebook://", summary: "dd", bullets: [], tags: [] },
        { id: "n2", organization: "Github://", summary: "deedydas", bullets: [], tags: [] },
        { id: "n3", organization: "LinkedIn://", summary: "debarghyadas", bullets: [], tags: [] },
        { id: "n4", organization: "YouTube://", summary: "DeedyDash007", bullets: [], tags: [] },
        { id: "n5", organization: "Twitter://", summary: "@debarghya_das", bullets: [], tags: [] },
        { id: "n6", organization: "Quora://", summary: "Debarghya-Das", bullets: [], tags: [] },
      ],
    },
    {
      id: "s-research",
      kind: "research",
      title: "Research",
      visible: true,
      layout: "entries",
      column: "main",
      entries: [
        {
          id: "r1",
          organization: "Cornell Robot Learning Lab",
          position: "Researcher",
          location: "Ithaca, NY",
          dateStart: "Jan 2014",
          dateEnd: "Jan 2015",
          summary:
            "Worked with Ashesh Jain and Prof Ashutosh Saxena to create PlanIt, a tool which learns from large scale user preference feedback to plan robot trajectories in human environments.",
          bullets: [],
          tags: [],
        },
        {
          id: "r2",
          organization: "Cornell Phonetics Lab",
          position: "Head Undergraduate Researcher",
          location: "Ithaca, NY",
          dateStart: "Mar 2012",
          dateEnd: "May 2013",
          summary:
            "Led the development of QuickTongue, the first ever breakthrough tongue-controlled game with Prof Sam Tilsen to aid in Linguistics research.",
          bullets: [],
          tags: [],
        },
      ],
    },
    {
      id: "s-courses",
      kind: "custom",
      title: "Coursework",
      visible: true,
      layout: "entries",
      column: "side",
      spacingAfter: 8,
      entries: [
        {
          id: "c1",
          organization: "Graduate",
          bullets: [
            "Advanced Machine Learning",
            "Open Source Software Engineering",
            "Advanced Interactive Graphics",
            "Compilers + Practicum",
            "Cloud Computing",
            "Evolutionary Computation",
            "Defending Computer Networks",
            "Machine Learning",
          ],
          tags: [],
        },
        {
          id: "c2",
          organization: "Undergraduate",
          bullets: [
            "Information Retrieval",
            "Operating Systems",
            "Artificial Intelligence + Practicum",
            "Functional Programming",
            "Computer Graphics + Practicum",
            "(Research Asst. & Teaching Asst 2x)",
            "Unix Tools and Scripting",
          ],
          tags: [],
        },
      ],
    },
    {
      id: "s-awards",
      kind: "awards",
      title: "Awards",
      visible: true,
      layout: "entries",
      column: "main",
      entries: [
        { id: "a1", dateStart: "2014", position: "top 52/2500", organization: "KPCB Engineering Fellow", bullets: [], tags: [] },
        { id: "a2", dateStart: "2014", position: "1st/50", organization: "Microsoft Coding Competition, Cornell", bullets: [], tags: [] },
        { id: "a3", dateStart: "2013", position: "National", organization: "Jump Trading Challenge Finalist", bullets: [], tags: [] },
        { id: "a4", dateStart: "2013", position: "7th/120", organization: "CS 3410 Cache Race Bot Tournament", bullets: [], tags: [] },
        { id: "a5", dateStart: "2012", position: "2nd/150", organization: "CS 3110 Biannual Intra-Class Bot Tournament", bullets: [], tags: [] },
        { id: "a6", dateStart: "2011", position: "National", organization: "Indian National Mathematics Olympiad (INMO) Finalist", bullets: [], tags: [] },
      ],
    },
    {
      id: "s-skills",
      kind: "skills",
      title: "Skills",
      visible: true,
      layout: "labeled",
      column: "side",
      entries: [
        { id: "k1", organization: "Programming", bullets: [], tags: [] },
        { id: "k2", detail: "Over 5000 lines:", bullets: [], tags: [] },
        { id: "k3", summary: "Java • Shell • Python • Javascript", bullets: [], tags: [] },
        { id: "k4", summary: "OCaml • Matlab • Rails • LATEX", bullets: [], tags: [] },
        { id: "k5", detail: "Over 1000 lines:", bullets: [], tags: [] },
        { id: "k6", summary: "C • C++ • CSS • PHP • Assembly", bullets: [], tags: [] },
        { id: "k7", detail: "Familiar:", bullets: [], tags: [] },
        { id: "k8", summary: "AS3 • iOS • Android • MySQL", bullets: [], tags: [] },
      ],
    },
    {
      id: "s-pub",
      kind: "publications",
      title: "Publications",
      visible: true,
      layout: "entries",
      column: "main",
      entries: [
        {
          id: "p1",
          organization: "[1]",
          summary:
            "A. Jain, D. Das, and A. Saxena. Planit: A crowdsourcing approach for learning to plan paths from large scale preference feedback. Tech Report, ICRA, in press.",
          bullets: [],
          tags: [],
        },
        {
          id: "p2",
          organization: "[2]",
          summary:
            "S. Tilsen, D. Das, and B. McKee. Real-time articulatory biofeedback with electromagnetic articulography. Linguistics Vanguard, in press.",
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
