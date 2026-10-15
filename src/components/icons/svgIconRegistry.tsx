import type { SVGProps } from "react";
import { AccountIcon, NavGuideIcon, NavHistoryIcon, NavHomeIcon, NavRecordIcon, NavSpacesIcon, SparkleIcon } from "./navIcons";
import { SpaceBathIcon, SpaceBedIcon, SpaceKitchenIcon, SpaceLivingIcon, SpaceTerraceIcon } from "./spaceIcons";
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, MoreIcon, PlusIcon } from "./uiIcons";
import {
  ObjectAirPurifierIcon,
  ObjectBeddingIcon,
  ObjectCountertopIcon,
  ObjectDrainIcon,
  ObjectFloorIcon,
  ObjectHoodIcon,
  ObjectKitchenSinkIcon,
  ObjectMirrorIcon,
  ObjectPillowIcon,
  ObjectShelfIcon,
  ObjectShowerIcon,
  ObjectSinkIcon,
  ObjectToiletIcon,
} from "./objectIcons";

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
  "object-kitchen-sink": ObjectKitchenSinkIcon,
  "object-countertop": ObjectCountertopIcon,
  "object-hood": ObjectHoodIcon,
  "object-shelf": ObjectShelfIcon,
  "object-air-purifier": ObjectAirPurifierIcon,
  "object-bedding": ObjectBeddingIcon,
  "object-pillow": ObjectPillowIcon,
  "chevron-left": ChevronLeftIcon,
  "chevron-right": ChevronRightIcon,
  "chevron-down": ChevronDownIcon,
  check: CheckIcon,
  plus: PlusIcon,
  more: MoreIcon,
} satisfies Record<string, (props: SVGProps<SVGSVGElement>) => import("react").ReactElement>;

export type SvgIconName = keyof typeof svgIconRegistry;
