import type { ComponentType, SVGProps } from "react";
import type { StudentAchievement } from "@/lib/data";
import {
  AcademicIcon,
  ResearchIcon,
  TechnicalIcon,
  CompetitionIcon,
  SportsIcon,
  CulturalIcon,
  LeadershipIcon,
  CareerIcon,
} from "@/components/icons";

/**
 * Groups the (unmodified) `studentAchievements` list into meaningful
 * categories for display. The source data keeps its shape — categorisation
 * is derived here, so adding an achievement in `data.ts` needs no change:
 * it is auto-classified by its wording, with its `tag` as a fallback.
 */

export interface AchievementCategory {
  id: string;
  title: string;
  /** Short line describing the category, shown under the title. */
  subtitle: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Whole-word signals used to auto-classify an achievement. */
  keywords: string[];
}

/**
 * Categories in the order they should appear on the page. Only categories
 * that end up with at least one achievement are rendered.
 */
export const achievementCategories: AchievementCategory[] = [
  {
    id: "academic",
    title: "Academic Excellence",
    subtitle: "Ranks, medals and academic distinction",
    Icon: AcademicIcon,
    keywords: [
      "gold medal",
      "silver medal",
      "medal",
      "university rank",
      "first rank",
      "cgpa",
      "topper",
      "scholarship",
      "dean's list",
    ],
  },
  {
    id: "research",
    title: "Research, Publications & Conferences",
    subtitle: "Papers, publications and research projects",
    Icon: ResearchIcon,
    keywords: [
      "paper",
      "journal",
      "publication",
      "published",
      "patent",
      "conference",
      "research",
      "symposium",
      "poster",
    ],
  },
  {
    id: "technical",
    title: "Technical & Innovation",
    subtitle: "Hackathons, IoT, robotics and engineering builds",
    Icon: TechnicalIcon,
    keywords: [
      "hackathon",
      "iot",
      "robot",
      "robotics",
      "prototype",
      "formula",
      "racing",
      "satellite",
      "software",
      "automation",
      "drone",
      "rfid",
      "vehicle",
      "smart home",
    ],
  },
  {
    id: "competitions",
    title: "Competitions",
    subtitle: "Case, business, quiz and design contests",
    Icon: CompetitionIcon,
    keywords: [
      "case",
      "business plan",
      "business-plan",
      "quiz",
      "competition",
      "challenge",
      "contest",
      "olympiad",
    ],
  },
  {
    id: "sports",
    title: "Sports",
    subtitle: "On the field, court and range",
    Icon: SportsIcon,
    keywords: [
      "football",
      "cricket",
      "kho-kho",
      "hockey",
      "basketball",
      "archery",
      "athletics",
      "volleyball",
      "badminton",
      "swimming",
      "chess",
    ],
  },
  {
    id: "cultural",
    title: "Cultural & Extra-Curricular",
    subtitle: "Music, dance, debate and the arts",
    Icon: CulturalIcon,
    keywords: [
      "dance",
      "music",
      "drama",
      "theatre",
      "debate",
      "debating",
      "public speaking",
      "choreograph",
      "singing",
      "poetry",
      "photography",
      "literary",
    ],
  },
  {
    id: "leadership",
    title: "Leadership & Community",
    subtitle: "Chapters, clubs and community impact",
    Icon: LeadershipIcon,
    keywords: [
      "chapter",
      "student council",
      "nss",
      "volunteer",
      "community",
      "leadership",
      "mentorship",
    ],
  },
  {
    id: "career",
    title: "Career & Professional",
    subtitle: "Internships, placements and certifications",
    Icon: CareerIcon,
    keywords: [
      "internship",
      "placement",
      "certification",
      "industrial training",
    ],
  },
];

/**
 * Precedence for auto-classification (first match wins). Ordered so that
 * strong, unambiguous signals win over generic ones — e.g. an award that is
 * both a "paper" and a "design challenge" is filed under Research first, and a
 * technical build described with "business plan" stays under Technical.
 */
const matchOrder = [
  "sports",
  "cultural",
  "academic",
  "research",
  "technical",
  "competitions",
  "leadership",
  "career",
] as const;

/**
 * Fallback map for achievements whose wording carries no category keyword —
 * classified by their editorial `tag` instead.
 */
const tagToCategory: Record<string, string> = {
  "First Prize": "research",
  "First Place": "technical",
  "Design Thinking": "competitions",
  Debate: "cultural",
  Global: "research",
};

/** Category id used when nothing else matches — a generic contest win. */
const DEFAULT_CATEGORY = "competitions";

const byId = new Map(achievementCategories.map((c) => [c.id, c]));

/** Whole-word (case-insensitive) test so "case" ≠ "showcase", "iot" ≠ "patriot". */
function mentions(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
}

function categoryIdFor(a: StudentAchievement): string {
  const text = `${a.title} ${a.detail}`;
  for (const id of matchOrder) {
    const cat = byId.get(id);
    if (cat && cat.keywords.some((k) => mentions(text, k))) return id;
  }
  return tagToCategory[a.tag] ?? DEFAULT_CATEGORY;
}

export interface CategorizedAchievements {
  category: AchievementCategory;
  items: StudentAchievement[];
}

/**
 * Buckets achievements into their categories, preserving both the source
 * order within each bucket and the display order of `achievementCategories`.
 * Empty categories are dropped.
 */
export function categorizeAchievements(
  achievements: StudentAchievement[],
): CategorizedAchievements[] {
  const buckets = new Map<string, StudentAchievement[]>();
  for (const a of achievements) {
    const id = categoryIdFor(a);
    (buckets.get(id) ?? buckets.set(id, []).get(id)!).push(a);
  }
  return achievementCategories
    .map((category) => ({ category, items: buckets.get(category.id) ?? [] }))
    .filter((group) => group.items.length > 0);
}
