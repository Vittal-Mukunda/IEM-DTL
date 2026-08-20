/**
 * The template registry — the only module in which a template id appears.
 *
 * `core/` must never import from here (enforced by the ESLint boundary rule in
 * `eslint.config.mjs`), which is what keeps "add a template without touching
 * the engine" true rather than aspirational.
 *
 * To add one: drop a folder beside these, import it below, and add it to
 * `registry`. Nothing else in the application changes.
 */

import type { TemplateDefinition } from "../core/schema";
import { altacv } from "./altacv/template";
import { awesomeCv } from "./awesome-cv/template";
import { berkeley } from "./berkeley/template";
import { columbia } from "./columbia/template";
import { cornell } from "./cornell/template";
import { deedy } from "./deedy/template";
import { gatech } from "./gatech/template";
import { harvard } from "./harvard/template";
import { jakes } from "./jakes/template";
import { mit } from "./mit/template";
import { princeton } from "./princeton/template";
import { purdue } from "./purdue/template";
import { stanford } from "./stanford/template";
import { uchicago } from "./uchicago/template";
import { utaustin } from "./utaustin/template";
import { wisconsin } from "./wisconsin/template";
import { yale } from "./yale/template";

const registry = {
  harvard,
  yale,
  princeton,
  uchicago,
  jakes,
  gatech,
  mit,
  cornell,
  columbia,
  wisconsin,
  berkeley,
  stanford,
  purdue,
  utaustin,
  deedy,
  "awesome-cv": awesomeCv,
  altacv,
} satisfies Record<string, TemplateDefinition>;

export type TemplateId = keyof typeof registry;

export const templates: Record<string, TemplateDefinition> = registry;

/**
 * Picker order — deliberate rather than alphabetical. The conservative,
 * universally-accepted layouts come first, because that is what most students
 * applying for placements should be using; the expressive ones come last.
 */
export const templateOrder: string[] = [
  "harvard",
  "yale",
  "princeton",
  "uchicago",
  "jakes",
  "gatech",
  "mit",
  "cornell",
  "columbia",
  "wisconsin",
  "berkeley",
  "stanford",
  "purdue",
  "utaustin",
  "deedy",
  "awesome-cv",
  "altacv",
];

export const templateList: TemplateDefinition[] = templateOrder
  .map((id) => registry[id as TemplateId])
  .filter(Boolean);

export const DEFAULT_TEMPLATE_ID = "harvard";

export function getTemplate(id: string): TemplateDefinition {
  const found = templates[id];
  if (!found) {
    throw new Error(
      `Unknown résumé template "${id}". Known: ${Object.keys(templates).join(", ")}.`,
    );
  }
  return found;
}

export function hasTemplate(id: string): boolean {
  return id in templates;
}
