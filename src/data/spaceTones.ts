export type SpaceToneKey = "bathroom" | "kitchen" | "living" | "bedroom" | "entry" | "terrace";

export type SpaceTone = {
  fill: string;
  border: string;
  text: string;
  feedback: string;
  /** Static bg classes for timeline dots/lines (same colors as text/border) — runtime class rewriting isn't seen by Tailwind JIT. */
  dot: string;
  line: string;
  tint: string;
  rgb: [number, number, number];
};

export const spaceToneLabels: Record<SpaceToneKey, string> = {
  bathroom: "욕실",
  kitchen: "주방",
  living: "거실",
  bedroom: "방",
  entry: "현관",
  terrace: "테라스",
};

export const spaceTones: Record<SpaceToneKey, SpaceTone> = {
  bathroom: {
    fill: "bg-sky-bath",
    border: "border-[#B8DCFF]",
    text: "text-space-bath-icon",
    feedback: "bg-sky-bath/80",
    dot: "bg-space-bath-icon",
    line: "bg-[#B8DCFF]",
    tint: "#DCEEFE",
    rgb: [184, 220, 255],
  },
  kitchen: {
    fill: "bg-sky-kitchen",
    border: "border-[#FECA94]",
    text: "text-space-kitchen-icon",
    feedback: "bg-sky-kitchen/80",
    dot: "bg-space-kitchen-icon",
    line: "bg-[#FECA94]",
    tint: "#FBE8D4",
    rgb: [254, 202, 148],
  },
  living: {
    fill: "bg-sky-living",
    border: "border-[#D2C4F0]",
    text: "text-space-living-icon",
    feedback: "bg-sky-living/80",
    dot: "bg-space-living-icon",
    line: "bg-[#D2C4F0]",
    tint: "#E9E1FA",
    rgb: [210, 196, 240],
  },
  bedroom: {
    fill: "bg-sky-bed",
    border: "border-[#BEE5A7]",
    text: "text-space-bed-icon",
    feedback: "bg-sky-bed/80",
    dot: "bg-space-bed-icon",
    line: "bg-[#BEE5A7]",
    tint: "#E2EFDA",
    rgb: [190, 229, 167],
  },
  entry: {
    fill: "bg-[#F7F4EE]",
    border: "border-[#DED7C9]",
    text: "text-[#5E5545]",
    feedback: "bg-[#F7F4EE]/80",
    dot: "bg-[#5E5545]",
    line: "bg-[#DED7C9]",
    tint: "#F7F4EE",
    rgb: [222, 215, 201],
  },
  terrace: {
    fill: "bg-[#F3F8E6]",
    border: "border-[#DAE9B0]",
    text: "text-[#536B16]",
    feedback: "bg-[#F3F8E6]/80",
    dot: "bg-[#536B16]",
    line: "bg-[#DAE9B0]",
    tint: "#F3F8E6",
    rgb: [218, 233, 176],
  },
};

/** Look up a tone by its Korean space label (욕실/주방/거실/방/현관/테라스, plus legacy "침실" / "침실 / 방"). */
export const spaceToneByLabel: Record<string, SpaceTone> = Object.fromEntries(
  (Object.keys(spaceTones) as SpaceToneKey[]).map((key) => [spaceToneLabels[key], spaceTones[key]]),
);
spaceToneByLabel["침실 / 방"] = spaceTones.bedroom;
spaceToneByLabel["침실"] = spaceTones.bedroom;

const fallbackTone: SpaceTone = {
  fill: "bg-surface-container-low",
  border: "border-outline-variant",
  text: "text-on-surface-variant",
  feedback: "bg-surface-container-low/80",
  dot: "bg-on-surface-variant",
  line: "bg-outline-variant",
  tint: "#E4E9EE",
  rgb: [228, 233, 238],
};

/** Loose lookup for call sites that key by a plain `string` (e.g. data loaded from storage). */
export const getSpaceTone = (key: string): SpaceTone => spaceTones[key as SpaceToneKey] ?? fallbackTone;
