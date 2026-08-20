/**
 * Jake's Resume, transcribed from the compiled original.
 *
 * The fixture the verifier diffs against `original.pdf`.
 */

import type { ResumeDoc } from "../core/model";

export const jakesOriginal: ResumeDoc = {
  version: 1,
  templateId: "jakes",
  personal: {
    name: "Jake Ryan",
    links: [
      { id: "l1", kind: "phone", label: "123-456-7890" },
      { id: "l2", kind: "email", label: "jake@su.edu" },
      { id: "l3", kind: "linkedin", label: "linkedin.com/in/jake" },
      { id: "l4", kind: "github", label: "github.com/jake" },
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
          organization: "Southwestern University",
          location: "Georgetown, TX",
          position: "Bachelor of Arts in Computer Science, Minor in Business",
          dateStart: "Aug. 2018",
          dateEnd: "May 2021",
          bullets: [],
          tags: [],
        },
        {
          id: "e2",
          organization: "Blinn College",
          location: "Bryan, TX",
          position: "Associate's in Liberal Arts",
          dateStart: "Aug. 2014",
          dateEnd: "May 2018",
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
          organization: "Undergraduate Research Assistant",
          position: "Texas A&M University",
          location: "College Station, TX",
          dateStart: "June 2020",
          current: true,
          bullets: [
            "Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems",
            "Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data",
            "Explored ways to visualize GitHub collaboration in a classroom setting",
          ],
          tags: [],
        },
        {
          id: "x2",
          organization: "Information Technology Support Specialist",
          position: "Southwestern University",
          location: "Georgetown, TX",
          dateStart: "Sep. 2018",
          current: true,
          bullets: [
            "Communicate with managers to set up campus computers used on campus",
            "Assess and troubleshoot computer problems brought by students, faculty and staff",
            "Maintain upkeep of computers, classroom equipment, and 200 printers across campus",
          ],
          tags: [],
        },
        {
          id: "x3",
          organization: "Artificial Intelligence Research Assistant",
          position: "Southwestern University",
          location: "Georgetown, TX",
          dateStart: "May 2019",
          dateEnd: "July 2019",
          bullets: [
            "Explored methods to generate video game dungeons based off of The Legend of Zelda",
            "Developed a game in Java to test the generated dungeons",
            "Contributed 50K+ lines of code to an established codebase via Git",
            "Conducted a human subject study to determine which video game dungeon generation technique is enjoyable",
            "Wrote an 8-page paper and gave multiple presentations on-campus",
            "Presented virtually to the World Conference on Computational Intelligence",
          ],
          tags: [],
        },
      ],
    },
    {
      id: "s-proj",
      kind: "projects",
      title: "Projects",
      visible: true,
      layout: "entries",
      entries: [
        {
          id: "p1",
          organization: "Gitlytics",
          dateStart: "June 2020",
          current: true,
          tags: ["Python", "Flask", "React", "PostgreSQL", "Docker"],
          bullets: [
            "Developed a full-stack web application using with Flask serving a REST API with React as the frontend",
            "Implemented GitHub OAuth to get data from user's repositories",
            "Visualized GitHub data to show collaboration",
            "Used Celery and Redis for asynchronous tasks",
          ],
        },
        {
          id: "p2",
          organization: "Simple Paintball",
          dateStart: "May 2018",
          dateEnd: "May 2020",
          tags: ["Spigot API", "Java", "Maven", "TravisCI", "Git"],
          bullets: [
            "Developed a Minecraft server plugin to entertain kids during free time for a previous job",
            "Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review",
            "Implemented continuous delivery using TravisCI to build the plugin upon new a release",
            "Collaborated with Minecraft server administrators to suggest features and get feedback about the plugin",
          ],
        },
      ],
    },
    {
      id: "s-skills",
      kind: "skills",
      title: "Technical Skills",
      visible: true,
      layout: "labeled",
      entries: [
        {
          id: "k1",
          organization: "Languages",
          summary: "Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R",
          bullets: [],
          tags: [],
        },
        {
          id: "k2",
          organization: "Frameworks",
          summary: "React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI",
          bullets: [],
          tags: [],
        },
        {
          id: "k3",
          organization: "Developer Tools",
          summary: "Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual Studio, PyCharm, IntelliJ, Eclipse",
          bullets: [],
          tags: [],
        },
        {
          id: "k4",
          organization: "Libraries",
          summary: "pandas, NumPy, Matplotlib",
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
