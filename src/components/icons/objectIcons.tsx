import type { ReactElement, SVGProps } from "react";

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

const strokeProps = {
  stroke: "#5B7A8C",
  strokeWidth: 2.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ObjectSinkIcon: IconComponent = (props) => (
  <svg viewBox="0 0 43.34 45.9646" width="1em" height="1.06em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1.15 21.3756H42.19V28.1805C42.19 39.522 1.15 39.522 1.15 28.1805V21.3756Z" fill="white" {...strokeProps} />
    <path
      d="M21.67 28.9366C33.0029 28.9366 42.19 25.5514 42.19 21.3756C42.19 17.1998 33.0029 13.8146 21.67 13.8146C10.3371 13.8146 1.15 17.1998 1.15 21.3756C1.15 25.5514 10.3371 28.9366 21.67 28.9366Z"
      fill="#E3F5FF"
      {...strokeProps}
    />
    <path d="M21.67 15.3268V6.25366C21.67 -0.55122 34.59 -0.55122 34.59 6.25366V10.0341M19.39 33.4732V44.8146H29.27" fill="none" {...strokeProps} />
  </svg>
);

export const ObjectToiletIcon: IconComponent = (props) => (
  <svg viewBox="0 0 37.26 46.1537" width="1em" height="1.24em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M26.99 1.15H10.27C7.75158 1.15 5.71 3.1811 5.71 5.68659V15.5159C5.71 18.0213 7.75158 20.0524 10.27 20.0524H26.99C29.5084 20.0524 31.55 18.0213 31.55 15.5159V5.68659C31.55 3.1811 29.5084 1.15 26.99 1.15Z" fill="white" {...strokeProps} />
    <path d="M1.15 20.8085H36.11C36.11 32.15 30.79 37.4427 18.63 37.4427V45.0037H7.23V31.3939" fill="white" {...strokeProps} />
    <path
      d="M18.63 26.1012C28.2839 26.1012 36.11 23.7316 36.11 20.8085C36.11 17.8855 28.2839 15.5159 18.63 15.5159C8.97606 15.5159 1.15 17.8855 1.15 20.8085C1.15 23.7316 8.97606 26.1012 18.63 26.1012Z"
      fill="#E3F5FF"
      {...strokeProps}
    />
    <path d="M23.19 7.95488H26.99" fill="none" {...strokeProps} />
  </svg>
);

export const ObjectShowerIcon: IconComponent = (props) => (
  <svg viewBox="0 0 44.1 50.3122" width="1em" height="1.14em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.67 48.4061V9.08902C2.67 -1.49634 23.95 -1.49634 23.95 9.08902V11.3573" fill="none" {...strokeProps} />
    <path d="M14.07 13.6256C14.07 4.55244 35.35 4.55244 35.35 13.6256H14.07Z" fill="white" {...strokeProps} />
    <path
      d="M15.59 20.4305L13.31 26.4793M24.71 20.4305V26.4793M33.07 20.4305L35.35 26.4793M14.83 31.772L12.55 37.8207M24.71 31.772V37.8207M34.59 31.772L36.87 37.8207"
      fill="none"
      {...strokeProps}
    />
    <path d="M1.15 49.1622H42.95" fill="none" {...strokeProps} />
  </svg>
);

export const ObjectMirrorIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46.38 49.9341" width="1em" height="1.08em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M23.95 1.15H22.43C12.7761 1.15 4.95 8.93588 4.95 18.5402V27.6134C4.95 37.2178 12.7761 45.0037 22.43 45.0037H23.95C33.6039 45.0037 41.43 37.2178 41.43 27.6134V18.5402C41.43 8.93588 33.6039 1.15 23.95 1.15Z"
      fill="white"
      {...strokeProps}
    />
    <path d="M13.31 17.028L23.19 7.95488M14.83 27.6134L33.07 10.2232M1.15 48.7841H45.23" fill="none" {...strokeProps} />
    <path
      d="M30.03 30.6378L31.55 34.4183L35.35 35.9305L31.55 37.4427L30.03 41.2232L28.51 37.4427L24.71 35.9305L28.51 34.4183L30.03 30.6378Z"
      fill="#8FD8FF"
      {...strokeProps}
    />
  </svg>
);

export const ObjectFloorIcon: IconComponent = (props) => (
  <svg viewBox="0 0 48.66 40.8613" width="1em" height="0.84em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1.91 27.6137L24.71 16.2723L47.51 27.6137L24.71 39.7113L1.91 27.6137Z" fill="#E3F5FF" {...strokeProps} />
    <path
      d="M12.55 22.321L35.35 34.4186M14.07 33.6625L36.11 22.321M29.27 1.15031L22.43 22.321"
      fill="none"
      {...strokeProps}
    />
    <path d="M11.79 24.5893L26.99 18.5406L33.83 24.5893L18.63 31.3942L11.79 24.5893Z" fill="white" {...strokeProps} />
    <path d="M4.95 4.9308V12.4918M1.15 8.71129H8.75" fill="none" {...strokeProps} />
  </svg>
);

export const ObjectDrainIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46.38 44.6415" width="1em" height="0.96em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M23.19 43.4915C35.3624 43.4915 45.23 37.0597 45.23 29.1256C45.23 21.1916 35.3624 14.7598 23.19 14.7598C11.0176 14.7598 1.15 21.1916 1.15 29.1256C1.15 37.0597 11.0176 43.4915 23.19 43.4915Z"
      fill="white"
      {...strokeProps}
    />
    <path
      d="M23.19 38.1988C31.5847 38.1988 38.39 34.1366 38.39 29.1256C38.39 24.1146 31.5847 20.0524 23.19 20.0524C14.7953 20.0524 7.99 24.1146 7.99 29.1256C7.99 34.1366 14.7953 38.1988 23.19 38.1988Z"
      fill="#E3F5FF"
      {...strokeProps}
    />
    <path
      d="M13.31 24.589L33.07 32.15M18.63 21.5646L31.55 26.8573M14.07 30.6378L26.23 35.9305M23.19 1.15C15.59 10.9793 15.59 15.5159 23.19 15.5159C30.79 15.5159 30.79 10.9793 23.19 1.15Z"
      fill="#8FD8FF"
      {...strokeProps}
    />
  </svg>
);

// --- 주방 · 거실 · 방 object art (2026-10-16), drawn in the same language as the 욕실 set:
// 2.3px #5B7A8C rounded strokes, white + #E3F5FF fills, #8FD8FF accent, 46×46 box.
const accent = "#8FD8FF";
const tint = "#E3F5FF";

export const ObjectKitchenSinkIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46 46" width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8 28H38V34C38 38.4 34.4 42 30 42H16C11.6 42 8 38.4 8 34V28Z" fill={tint} {...strokeProps} />
    <rect x="1.15" y="22" width="43.7" height="6" rx="1.5" fill="white" {...strokeProps} />
    <path d="M31 22V9.5C31 4.2 22.5 4.2 22.5 9.5V11.5M28 22H34" fill="none" {...strokeProps} />
    <path d="M22.5 14.5C21 16.8 21 18.4 22.5 18.4C24 18.4 24 16.8 22.5 14.5Z" fill={accent} {...strokeProps} />
  </svg>
);

export const ObjectCountertopIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46 46" width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2.3" y="15" width="32" height="25" rx="6" fill={tint} {...strokeProps} />
    <circle cx="28.3" cy="21" r="2" fill="white" {...strokeProps} />
    <path d="M15 6.5C18 5.5 30 18 33.5 25L30 28.5L12.5 10.5C12.5 8.5 13.5 7 15 6.5Z" fill="white" {...strokeProps} />
    <path d="M32 27L42.5 37.5" fill="none" {...strokeProps} strokeWidth={4} />
    <path d="M1.15 44.5H44.85" fill="none" {...strokeProps} />
  </svg>
);

export const ObjectHoodIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46 46" width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="17" y="1.15" width="12" height="11" rx="1.5" fill="white" {...strokeProps} />
    <path d="M6 25L15 12.15H31L40 25H6Z" fill="white" {...strokeProps} />
    <rect x="2.3" y="25" width="41.4" height="6" rx="2" fill={tint} {...strokeProps} />
    <path d="M10 28H36" fill="none" {...strokeProps} strokeDasharray="2.5 3.5" />
    <path d="M16 37C14.5 38.7 17.5 40.3 16 42M23 36.5C21.5 38.2 24.5 39.8 23 41.5M30 37C28.5 38.7 31.5 40.3 30 42" fill="none" {...strokeProps} stroke={accent} />
  </svg>
);

export const ObjectDishRackIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46 46" width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="16" cy="21" r="12" fill="white" {...strokeProps} />
    <circle cx="16" cy="21" r="6" fill={tint} {...strokeProps} />
    <path d="M29 18H39L37.5 32H30.5L29 18Z" fill={tint} {...strokeProps} />
    <path d="M3 33H43V38C43 40 41.5 41.5 39.5 41.5H6.5C4.5 41.5 3 40 3 38V33Z" fill="white" {...strokeProps} />
    <path d="M10 37H36" fill="none" {...strokeProps} strokeDasharray="2.5 3.5" />
  </svg>
);

export const ObjectFridgeIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46 46" width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="9" y="1.5" width="28" height="43" rx="5" fill="white" {...strokeProps} />
    <path d="M9 17H37" fill="none" {...strokeProps} />
    <rect x="12.5" y="20.5" width="21" height="20.5" rx="2.5" fill={tint} stroke="none" />
    <path d="M14.5 7V12M14.5 22V30" fill="none" {...strokeProps} strokeWidth={3} />
    <path d="M27 9.5C25.6 11.5 25.6 12.8 27 12.8C28.4 12.8 28.4 11.5 27 9.5Z" fill={accent} {...strokeProps} />
  </svg>
);

export const ObjectFoodBinIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46 46" width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18 7.5C18 4.5 28 4.5 28 7.5" fill="none" {...strokeProps} />
    <rect x="6" y="8" width="34" height="7" rx="2.5" fill="white" {...strokeProps} />
    <path d="M9 15H37L34.5 40C34.3 42 32.8 43.5 30.8 43.5H15.2C13.2 43.5 11.7 42 11.5 40L9 15Z" fill={tint} {...strokeProps} />
    <path d="M23 23C18.5 26 18.5 32 23 35C27.5 32 27.5 26 23 23Z" fill={accent} {...strokeProps} />
    <path d="M23 26V35" fill="none" {...strokeProps} />
  </svg>
);

export const ObjectShelfIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46 46" width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="7" y="11" width="6.5" height="19" rx="1.2" fill={tint} {...strokeProps} />
    <rect x="13.5" y="15" width="6.5" height="15" rx="1.2" fill="white" {...strokeProps} />
    <path d="M21 30L24.6 16.2L30.2 17.6L26.8 30" fill={tint} {...strokeProps} />
    <path d="M37.5 22C37.5 16.5 34 14 30.8 14C30.8 18.5 34 21.5 37.5 22ZM37.5 22C37.5 15.5 41 12.5 44 12.5C44 17.5 41 21.5 37.5 22Z" fill={accent} {...strokeProps} />
    <path d="M32.5 22H42.5L41 30H34Z" fill="white" {...strokeProps} />
    <rect x="1.15" y="30" width="43.7" height="5" rx="1.5" fill="white" {...strokeProps} />
    <path d="M8 35V41M38 35V41" fill="none" {...strokeProps} />
  </svg>
);

export const ObjectAirPurifierIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46 46" width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="12" y="5" width="24" height="39.85" rx="6.5" fill="white" {...strokeProps} />
    <rect x="16.5" y="9.5" width="15" height="4" rx="2" fill={tint} {...strokeProps} />
    <circle cx="24" cy="28.5" r="7.5" fill={tint} {...strokeProps} />
    <circle cx="24" cy="28.5" r="2.5" fill="white" {...strokeProps} />
    <path d="M2.3 18H8M1.15 24H7M2.3 30H8" fill="none" {...strokeProps} stroke={accent} />
  </svg>
);

export const ObjectBeddingIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46 46" width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2.3" y="8" width="8" height="31" rx="3" fill="white" {...strokeProps} />
    <rect x="10.3" y="25" width="33.4" height="9" rx="3" fill="white" {...strokeProps} />
    <rect x="12" y="18.5" width="9" height="6.5" rx="3.2" fill="white" {...strokeProps} />
    <path d="M19 23C19 20.8 20.8 19 23 19H40.7C42.4 19 43.7 20.3 43.7 22V31C43.7 32.7 42.4 34 40.7 34H23C20.8 34 19 32.2 19 30V23Z" fill={tint} {...strokeProps} />
    <path d="M19 25.5H43.7" fill="none" {...strokeProps} />
    <path d="M6.3 39V43.5M39.7 34V43.5" fill="none" {...strokeProps} />
  </svg>
);

export const ObjectPillowIcon: IconComponent = (props) => (
  <svg viewBox="0 0 46 46" width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 14C14 10.5 30 10.5 39 14C42 22 42 30 39 38C30 41.5 14 41.5 5 38C2 30 2 22 5 14Z" fill={tint} {...strokeProps} />
    <path d="M10 18.5C17 16.5 27 16.5 34 18.5C35.8 23.5 35.8 28.5 34 33.5C27 35.5 17 35.5 10 33.5C8.2 28.5 8.2 23.5 10 18.5Z" fill="white" {...strokeProps} strokeDasharray="2.6 3" />
    <path d="M39 1.5L40.3 4.8L43.6 6.1L40.3 7.4L39 10.7L37.7 7.4L34.4 6.1L37.7 4.8L39 1.5Z" fill={accent} {...strokeProps} />
  </svg>
);
