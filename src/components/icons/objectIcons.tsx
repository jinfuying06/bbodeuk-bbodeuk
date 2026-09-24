import type { ReactElement, SVGProps } from "react";

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

const strokeProps = {
  stroke: "#64807A",
  strokeWidth: 2.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ObjectSinkIcon: IconComponent = (props) => (
  <svg viewBox="0 0 43.34 45.9646" width="1em" height="1.06em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1.15 21.3756H42.19V28.1805C42.19 39.522 1.15 39.522 1.15 28.1805V21.3756Z" fill="white" {...strokeProps} />
    <path
      d="M21.67 28.9366C33.0029 28.9366 42.19 25.5514 42.19 21.3756C42.19 17.1998 33.0029 13.8146 21.67 13.8146C10.3371 13.8146 1.15 17.1998 1.15 21.3756C1.15 25.5514 10.3371 28.9366 21.67 28.9366Z"
      fill="#E5F8F5"
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
      fill="#E5F8F5"
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
      fill="#8DE3DB"
      {...strokeProps}
    />
  </svg>
);

export const ObjectFloorIcon: IconComponent = (props) => (
  <svg viewBox="0 0 48.66 40.8613" width="1em" height="0.84em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1.91 27.6137L24.71 16.2723L47.51 27.6137L24.71 39.7113L1.91 27.6137Z" fill="#E5F8F5" {...strokeProps} />
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
      fill="#E5F8F5"
      {...strokeProps}
    />
    <path
      d="M13.31 24.589L33.07 32.15M18.63 21.5646L31.55 26.8573M14.07 30.6378L26.23 35.9305M23.19 1.15C15.59 10.9793 15.59 15.5159 23.19 15.5159C30.79 15.5159 30.79 10.9793 23.19 1.15Z"
      fill="#8DE3DB"
      {...strokeProps}
    />
  </svg>
);
