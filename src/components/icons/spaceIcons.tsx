import type { ReactElement, SVGProps } from "react";

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const SpaceBathIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g {...strokeProps}>
      <path d="M3 12H21V15C21 16.3261 20.4732 17.5979 19.5355 18.5355C18.5979 19.4732 17.3261 20 16 20H8C6.67392 20 5.40215 19.4732 4.46447 18.5355C3.52678 17.5979 3 16.3261 3 15V12Z" />
      <path d="M6 12V5C6 4.46957 6.21071 3.96086 6.58579 3.58579C6.96086 3.21071 7.46957 3 8 3C8.53043 3 9.03914 3.21071 9.41421 3.58579C9.78929 3.96086 10 4.46957 10 5M6 20V21M18 20V21" />
    </g>
  </svg>
);

export const SpaceKitchenIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      {...strokeProps}
      d="M2 12H4M20 12H22M8 7V4M12 7V3M16 7V4M4 10H20V16C20 17.0609 19.5786 18.0783 18.8284 18.8284C18.0783 19.5786 17.0609 20 16 20H8C6.93913 20 5.92172 19.5786 5.17157 18.8284C4.42143 18.0783 4 17.0609 4 16V10Z"
    />
  </svg>
);

export const SpaceLivingIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g {...strokeProps}>
      <path d="M5 11V8C5 7.20435 5.31607 6.44129 5.87868 5.87868C6.44129 5.31607 7.20435 5 8 5H16C16.7956 5 17.5587 5.31607 18.1213 5.87868C18.6839 6.44129 19 7.20435 19 8V11M5 18V21M19 18V21" />
      <path d="M5 12V14H19V12C19 11.4696 19.2107 10.9609 19.5858 10.5858C19.9609 10.2107 20.4696 10 21 10C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12V18H1V12C1 11.4696 1.21071 10.9609 1.58579 10.5858C1.96086 10.2107 2.46957 10 3 10C3.53043 10 4.03914 10.2107 4.41421 10.5858C4.78929 10.9609 5 11.4696 5 12Z" />
    </g>
  </svg>
);

export const SpaceBedIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g {...strokeProps}>
      <path d="M3 5V19V21M12 16V7H19C19.5304 7 20.0391 7.21071 20.4142 7.58579C20.7893 7.96086 21 8.46957 21 9V19V21M3 16H21" />
      <path d="M9 8H6C5.44772 8 5 8.44772 5 9V12C5 12.5523 5.44772 13 6 13H9C9.55228 13 10 12.5523 10 12V9C10 8.44772 9.55228 8 9 8Z" />
    </g>
  </svg>
);

export const SpaceTerraceIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path {...strokeProps} d="M3 11H21M4 11V21M8 11V21M12 11V21M16 11V21M20 11V21M3 21H21M5 8V3H19V8" />
  </svg>
);
