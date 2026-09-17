export type SpaceToneKey = "bathroom" | "kitchen" | "living" | "bedroom" | "entry" | "terrace";

export type SpaceTone = {
  fill: string;
  border: string;
  text: string;
  feedback: string;
  tint: string;
  rgb: [number, number, number];
};

export const spaceToneLabels: Record<SpaceToneKey, string> = {
  bathroom: "욕실",
  kitchen: "주방",
  living: "거실",
  bedroom: "침실",
  entry: "현관",
  terrace: "테라스",
};

export const spaceTones: Record<SpaceToneKey, SpaceTone> = {
  bathroom: {
    fill: "bg-[#EAF4FF]",
    border: "border-[#B8DCFF]",
    text: "text-primary",
    feedback: "bg-[#EAF4FF]/80",
    tint: "#EAF4FF",
    rgb: [184, 220, 255],
  },
  kitchen: {
    fill: "bg-[#FFF1E7]",
    border: "border-[#FFD6B8]",
    text: "text-[#8A4C00]",
    feedback: "bg-[#FFF1E7]/80",
    tint: "#FFF1E7",
    rgb: [255, 214, 184],
  },
  living: {
    fill: "bg-[#FFECEF]",
    border: "border-[#F9C9D2]",
    text: "text-[#9A4251]",
    feedback: "bg-[#FFECEF]/80",
    tint: "#FFECEF",
    rgb: [249, 201, 210],
  },
  bedroom: {
    fill: "bg-[#EFF8F5]",
    border: "border-[#C9E8DE]",
    text: "text-tertiary",
    feedback: "bg-[#EFF8F5]/80",
    tint: "#EFF8F5",
    rgb: [201, 232, 222],
  },
  entry: {
    fill: "bg-[#F7F4EE]",
    border: "border-[#DED7C9]",
    text: "text-[#5E5545]",
    feedback: "bg-[#F7F4EE]/80",
    tint: "#F7F4EE",
    rgb: [222, 215, 201],
  },
  terrace: {
    fill: "bg-[#F3F8E6]",
    border: "border-[#DAE9B0]",
    text: "text-[#536B16]",
    feedback: "bg-[#F3F8E6]/80",
    tint: "#F3F8E6",
    rgb: [218, 233, 176],
  },
};

/** Look up a tone by its Korean space label (욕실/주방/거실/침실/현관/테라스, or the "침실 / 방" setup variant). */
export const spaceToneByLabel: Record<string, SpaceTone> = Object.fromEntries(
  (Object.keys(spaceTones) as SpaceToneKey[]).map((key) => [spaceToneLabels[key], spaceTones[key]]),
);
spaceToneByLabel["침실 / 방"] = spaceTones.bedroom;

const fallbackTone: SpaceTone = {
  fill: "bg-surface-container-low",
  border: "border-outline-variant",
  text: "text-on-surface-variant",
  feedback: "bg-surface-container-low/80",
  tint: "#E4E9EE",
  rgb: [228, 233, 238],
};

/** Loose lookup for call sites that key by a plain `string` (e.g. data loaded from storage). */
export const getSpaceTone = (key: string): SpaceTone => spaceTones[key as SpaceToneKey] ?? fallbackTone;
