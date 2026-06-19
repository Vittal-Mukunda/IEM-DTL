// ──────────────────────────────────────────────────────────────────
//  "The X-Ray" — homepage storytelling experience.
//
//  Thesis: Industrial Engineering is invisible. It is the engineered
//  layer underneath the world you already use. So the page literally
//  X-rays six photographs of the real world — a scanner sweeps across
//  each one and the ordinary photo dissolves into the systems an IEM
//  graduate designs and runs underneath it.
//
//  Career content is the single source of truth in futuresData.ts
//  (`ecosystems`). Here we only attach the real-world photograph and a
//  couple of scan captions to each world.
// ──────────────────────────────────────────────────────────────────

import { ecosystems, type Ecosystem, type MotifId } from "@/components/futures/futuresData";
export { careerConstellation, futureEmployers } from "@/components/futures/futuresData";

export interface World extends Ecosystem {
  /** the real-world photograph (the "reality" layer) */
  photo: string;
  /** what the photo actually shows — pinned on the reality side */
  realCaption: string;
  /** terse readout shown by the scanner on the engineered side */
  scanLabel: string;
}

/** Photo + caption metadata, keyed by ecosystem id. */
const meta: Record<MotifId, { photo: string; realCaption: string; scanLabel: string }> = {
  ops: {
    photo: "/images/worlds/operations.jpg",
    realCaption: "A real manufacturing plant",
    scanLabel: "OPS // ANALYTICS",
  },
  scm: {
    photo: "/images/worlds/supply-chain.jpg",
    realCaption: "A global container network",
    scanLabel: "SUPPLY // NETWORK",
  },
  quality: {
    photo: "/images/worlds/quality.jpg",
    realCaption: "A machine-vision inspection cell",
    scanLabel: "QUALITY // CONTROL",
  },
  design: {
    photo: "/images/worlds/design.jpg",
    realCaption: "From CAD model to machined part",
    scanLabel: "DESIGN // MAKE",
  },
  mgmt: {
    photo: "/images/worlds/management.jpg",
    realCaption: "A company's workflow, mapped",
    scanLabel: "PEOPLE // PLAN",
  },
  finance: {
    photo: "/images/worlds/finance.jpg",
    realCaption: "Live markets on the desk",
    scanLabel: "MONEY // MARKET",
  },
};

export const worlds: World[] = ecosystems.map((e) => ({
  ...e,
  ...meta[e.id],
}));

export const introPhoto = "/images/iem-department.webp";
