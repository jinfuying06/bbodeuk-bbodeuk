import type { ReactElement, SVGProps } from "react";

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.46667,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const NavHomeIcon: IconComponent = (props) => (
  <svg viewBox="0 0 22 22" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g {...strokeProps}>
      <path d="M2.75 9.16667L11 2.75L19.25 9.16667V18.3333H2.75V9.16667Z" />
      <path d="M8.25 18.3333V11.9167H13.75V18.3333" />
    </g>
  </svg>
);

export const NavSpacesIcon: IconComponent = (props) => (
  <svg viewBox="0 0 22 22" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g {...strokeProps}>
      <path d="M7.33333 2.75H4.58333C3.57081 2.75 2.75 3.57081 2.75 4.58333V7.33333C2.75 8.34586 3.57081 9.16667 4.58333 9.16667H7.33333C8.34586 9.16667 9.16667 8.34586 9.16667 7.33333V4.58333C9.16667 3.57081 8.34586 2.75 7.33333 2.75Z" />
      <path d="M17.4167 2.75H14.6667C13.6541 2.75 12.8333 3.57081 12.8333 4.58333V7.33333C12.8333 8.34586 13.6541 9.16667 14.6667 9.16667H17.4167C18.4292 9.16667 19.25 8.34586 19.25 7.33333V4.58333C19.25 3.57081 18.4292 2.75 17.4167 2.75Z" />
      <path d="M7.33333 12.8333H4.58333C3.57081 12.8333 2.75 13.6541 2.75 14.6667V17.4167C2.75 18.4292 3.57081 19.25 4.58333 19.25H7.33333C8.34586 19.25 9.16667 18.4292 9.16667 17.4167V14.6667C9.16667 13.6541 8.34586 12.8333 7.33333 12.8333Z" />
      <path d="M17.4167 12.8333H14.6667C13.6541 12.8333 12.8333 13.6541 12.8333 14.6667V17.4167C12.8333 18.4292 13.6541 19.25 14.6667 19.25H17.4167C18.4292 19.25 19.25 18.4292 19.25 17.4167V14.6667C19.25 13.6541 18.4292 12.8333 17.4167 12.8333Z" />
    </g>
  </svg>
);

export const NavRecordIcon: IconComponent = (props) => (
  <svg viewBox="0 0 22 22" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path {...strokeProps} d="M11 4.58333V17.4167M4.58333 11H17.4167" />
  </svg>
);

export const NavHistoryIcon: IconComponent = (props) => (
  <svg viewBox="0 0 22 22" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g {...strokeProps}>
      <path d="M16.5 4.58333H5.5C3.98122 4.58333 2.75 5.81455 2.75 7.33333V16.5C2.75 18.0188 3.98122 19.25 5.5 19.25H16.5C18.0188 19.25 19.25 18.0188 19.25 16.5V7.33333C19.25 5.81455 18.0188 4.58333 16.5 4.58333Z" />
      <path d="M6.41667 2.75V6.41667M15.5833 2.75V6.41667M2.75 10.0833H19.25M7.33333 14.6667H8.25M13.75 14.6667H14.6667" />
    </g>
  </svg>
);

export const NavGuideIcon: IconComponent = (props) => (
  <svg viewBox="0 0 22 22" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      {...strokeProps}
      d="M11 19.25C13.75 17.4167 16.5 17.4167 19.25 18.3333V4.58333C17.4167 3.66667 13.75 2.75 11 5.5C8.25 2.75 4.58333 3.66667 2.75 4.58333V18.3333C5.5 17.4167 8.25 17.4167 11 19.25ZM11 5.5V19.25"
    />
  </svg>
);
