import type { StudentAchievement } from "@/lib/data";
import { categorizeAchievements } from "@/lib/achievementCategories";

/**
 * Student Achievements, grouped into categories. Each category is introduced
 * by a centered SVG pictogram, a title and a short subtitle, followed by the
 * existing achievement-card grid — so the presentation stays consistent with
 * the rest of the About page while the list reads as organised sections.
 *
 * The achievement data is used as-is; grouping is derived in
 * `categorizeAchievements` (see lib/achievementCategories).
 */
export default function StudentAchievements({
  achievements,
}: {
  achievements: StudentAchievement[];
}) {
  const groups = categorizeAchievements(achievements);

  return (
    <div className="space-y-12">
      {groups.map(({ category, items }) => (
        <section key={category.id} aria-labelledby={`ach-${category.id}`}>
          {/* Category header — centered icon, title, subtitle */}
          <header className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
              <category.Icon className="h-6 w-6" />
            </div>
            <h3
              id={`ach-${category.id}`}
              className="text-xl font-bold text-primary"
            >
              {category.title}
            </h3>
            <p className="text-sm text-text-muted mt-1">{category.subtitle}</p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((a) => (
              <div
                key={a.title}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
              >
                <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase tracking-wide mb-3">
                  {a.tag}
                </span>
                <h4 className="font-semibold text-primary text-sm leading-snug">
                  {a.title}
                </h4>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">
                  {a.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
