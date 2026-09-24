import type { SVGProps } from "react";
import { AccountIcon, NavGuideIcon, NavHistoryIcon, NavHomeIcon, NavRecordIcon, NavSpacesIcon, SparkleIcon } from "./navIcons";
import { SpaceBathIcon, SpaceBedIcon, SpaceKitchenIcon, SpaceLivingIcon, SpaceTerraceIcon } from "./spaceIcons";
import { ObjectDrainIcon, ObjectFloorIcon, ObjectMirrorIcon, ObjectShowerIcon, ObjectSinkIcon, ObjectToiletIcon } from "./objectIcons";

/** Brand SVG icons extracted from the Figma Sky/BB design system (see AGENTS.md §6). */
export const svgIconRegistry = {
  "nav-home": NavHomeIcon,
  "nav-spaces": NavSpacesIcon,
  "nav-record": NavRecordIcon,
  "nav-history": NavHistoryIcon,
  "nav-guide": NavGuideIcon,
  account: AccountIcon,
  sparkle: SparkleIcon,
  "space-bath": SpaceBathIcon,
  "space-kitchen": SpaceKitchenIcon,
  "space-living": SpaceLivingIcon,
  "space-bed": SpaceBedIcon,
  "space-terrace": SpaceTerraceIcon,
  "object-sink": ObjectSinkIcon,
  "object-toilet": ObjectToiletIcon,
  "object-shower": ObjectShowerIcon,
  "object-mirror": ObjectMirrorIcon,
  "object-floor": ObjectFloorIcon,
  "object-drain": ObjectDrainIcon,
} satisfies Record<string, (props: SVGProps<SVGSVGElement>) => import("react").ReactElement>;

export type SvgIconName = keyof typeof svgIconRegistry;
