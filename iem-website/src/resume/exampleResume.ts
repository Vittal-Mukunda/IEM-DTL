/**
 * The example résumé every student sees on their first visit.
 *
 * A blank form is a bad first impression: it shows nothing about how a template
 * reads, and it gives no model for how to write a bullet. So the builder opens
 * with a complete, plausible résumé that can be typed straight over.
 *
 * The default is an operations-research master's application, not a campus
 * placement résumé: university only (no high school), research before internships,
 * named OR coursework, and tools admissions committees actually look for.
 *
 * The content is doing two jobs. It has to exercise each template's features —
 * two-line entries, dates, coursework, bullets, technology tags, grouped skills
 * — so the preview is representative. And it has to be *good writing*, because
 * a student reading it will copy its shape: every bullet leads with a verb,
 * says what changed, and carries a number.
 *
 * It is deliberately one page in every template. The first thing anyone sees
 * should not be an overflow warning.
 */

import {
  DEFAULT_OPTIONS,
  emptyEntry,
  emptySection,
  newId,
  type Entry,
  type ResumeDoc,
  type Section,
  type SectionKind,
} from "./core/model";
import { specFor } from "./editor/sectionKinds";
import { DEFAULT_TEMPLATE_ID, getTemplate, hasTemplate } from "./templates";

const entry = (patch: Partial<Entry>): Entry => emptyEntry(patch);

/** Content per section kind, so any template's default order can be filled. */
const CONTENT: Partial<Record<SectionKind, { text?: string; entries?: Entry[] }>> = {
  summary: {
    text:
      "Industrial engineering undergraduate applying to M.S. programs in operations "
      + "research. Coursework in linear algebra, probability and optimization. "
      + "Writes integer programs in Gurobi and vehicle-routing models in OR-Tools.",
  },

  education: {
    entries: [
      entry({
        organization: "R.V. College of Engineering",
        location: "Bengaluru, KA",
        position: "B.E. Industrial Engineering & Management",
        summary: "CGPA 9.12 / 10",
        dateStart: "Aug 2022",
        dateEnd: "May 2026",
        detail:
          "Relevant Coursework: Linear Algebra, Probability & Statistics, "
          + "Operations Research, Stochastic Models, Discrete-Event Simulation.",
        bullets: ["Ranked 4th of 68 in the department."],
      }),
    ],
  },

  experience: {
    entries: [
      entry({
        organization: "Toyota Kirloskar Motor",
        location: "Bidadi, KA",
        position: "Industrial Engineering Intern",
        dateStart: "Jun 2025",
        dateEnd: "Aug 2025",
        bullets: [
          "Formulated a mixed-model line-balancing problem from MOST time standards on a 14-station trim line; the new assignment cut takt variance by 22% and added about 480 units of daily throughput.",
          "Ran a three-week time study across both shifts and wrote the standard work sheets the line uses today.",
        ],
        tags: ["Python", "MOST", "Excel"],
      }),
    ],
  },

  projects: {
    entries: [
      entry({
        organization: "Line-Balancing Simulator",
        position: "Team lead",
        dateStart: "Jan 2025",
        dateEnd: "Apr 2025",
        summary: "Discrete-event model that assigns tasks to stations on a mixed-model assembly line.",
        bullets: [
          "Benchmarked against Arena on 12 published instances; matched or beat the reported makespan on nine.",
        ],
        tags: ["Python", "SimPy", "integer programming"],
        url: "github.com/johndoe/line-balancer",
      }),
      entry({
        organization: "Campus Shuttle Routing",
        position: "Contributor",
        dateStart: "Aug 2024",
        dateEnd: "Nov 2024",
        summary: "Capacitated vehicle-routing model for the college shuttle fleet.",
        bullets: [
          "Cut average student wait from 14 minutes to 9 in simulation; the proposal is being piloted on two routes.",
        ],
        tags: ["OR-Tools", "Python"],
      }),
    ],
  },

  leadership: {
    entries: [
      entry({
        organization: "IEM Student Association",
        location: "RVCE",
        position: "Secretary",
        dateStart: "Jun 2024",
        current: true,
        bullets: [
          "Organised a two-day industry symposium for 200 students and 14 visiting engineers, run entirely on sponsorship.",
        ],
      }),
    ],
  },

  research: {
    entries: [
      entry({
        organization: "Operations Research Group, RVCE",
        location: "Bengaluru, KA",
        position: "Undergraduate Research Assistant",
        summary: "Stochastic scheduling under machine failure",
        dateStart: "Jan 2025",
        current: true,
        bullets: [
          "Implemented a rolling-horizon MIP in Gurobi and compared it with a greedy policy on 40 generated instances; expected tardiness fell 18%.",
        ],
        tags: ["Python", "Gurobi"],
      }),
    ],
  },

  awards: {
    entries: [
      entry({
        organization: "Smart India Hackathon — National Winner",
        position: "Ministry of Education",
        summary: "1st of 340 teams",
        dateStart: "Dec 2024",
      }),
    ],
  },

  skills: {
    entries: [
      entry({ organization: "Programming", summary: "Python (NumPy, pandas, OR-Tools), Gurobi, MATLAB, SQL" }),
      entry({ organization: "Methods", summary: "Linear and integer programming, stochastic models, discrete-event simulation" }),
      entry({ organization: "Software", summary: "Arena, Minitab, Excel" }),
    ],
  },

  interests: {
    entries: [
      entry({ organization: "Interests", summary: "Long-distance running, Carnatic violin, competitive quizzing" }),
    ],
  },
};

function sectionFor(kind: SectionKind, title: string): Section {
  const spec = specFor(kind);
  const section = emptySection(kind, title);
  section.layout = spec.layout;

  const content = CONTENT[kind];
  if (!content) {
    // A kind we have no example for still gets one blank entry to type into.
    section.entries = spec.layout === "paragraph" ? [] : [emptyEntry()];
    return section;
  }

  section.text = content.text;
  // Fresh ids each time, so two documents never share one.
  section.entries = (content.entries ?? []).map((e) => ({ ...e, id: newId("e") }));
  return section;
}

/**
 * The example, built in whatever section order the chosen template prefers.
 *
 * `example: true` marks it as not-yet-the-student's. Any edit clears the flag,
 * which is what dismisses the "this is an example" notice.
 */
export function exampleDoc(templateId = DEFAULT_TEMPLATE_ID): ResumeDoc {
  const template = hasTemplate(templateId)
    ? getTemplate(templateId)
    : getTemplate(DEFAULT_TEMPLATE_ID);

  return {
    version: 1,
    templateId: template.id,
    example: true,
    personal: {
      name: "John Doe",
      headline: "B.E. Industrial Engineering · Operations Research",
      links: [
        { id: newId("l"), kind: "location", label: "Bengaluru, KA" },
        { id: newId("l"), kind: "email", label: "john.doe@rvce.edu.in", href: "mailto:john.doe@rvce.edu.in" },
        { id: newId("l"), kind: "phone", label: "+91 98765 43210", href: "tel:+919876543210" },
        { id: newId("l"), kind: "linkedin", label: "linkedin.com/in/johndoe", href: "https://linkedin.com/in/johndoe" },
      ],
    },
    sections: template.sections.defaultOrder.map((kind) =>
      sectionFor(kind, template.sections.aliases[kind] ?? specFor(kind).title),
    ),
    options: { ...DEFAULT_OPTIONS },
  };
}

/** The same sections, with every field empty — for "clear it and start blank". */
export function blankDoc(templateId = DEFAULT_TEMPLATE_ID): ResumeDoc {
  const template = hasTemplate(templateId)
    ? getTemplate(templateId)
    : getTemplate(DEFAULT_TEMPLATE_ID);

  return {
    version: 1,
    templateId: template.id,
    personal: {
      name: "",
      headline: "",
      links: [
        { id: newId("l"), kind: "email", label: "" },
        { id: newId("l"), kind: "phone", label: "" },
        { id: newId("l"), kind: "linkedin", label: "" },
      ],
    },
    sections: template.sections.defaultOrder.map((kind) => {
      const spec = specFor(kind);
      const section = emptySection(kind, template.sections.aliases[kind] ?? spec.title);
      section.layout = spec.layout;
      section.entries = spec.layout === "paragraph" ? [] : [emptyEntry()];
      return section;
    }),
    options: { ...DEFAULT_OPTIONS },
  };
}
