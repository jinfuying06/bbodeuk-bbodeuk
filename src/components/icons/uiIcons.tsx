import type { ReactElement, SVGProps } from "react";

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

// UI glyphs (chevrons, more, check, plus): 24 grid, 2.4 stroke — same weight as the 내 공간 expand chevron.
const ui = (d: string): IconComponent =>
  function UiIcon(props) {
    return (
      <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d={d} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

export const ChevronLeftIcon = ui("M15 5l-7 7 7 7");
export const ChevronRightIcon = ui("M9 5l7 7-7 7");
export const ChevronDownIcon = ui("M7 10l5 5 5-5");
export const CheckIcon = ui("M5 12.5l4.5 4.5L19 7.5");
export const PlusIcon = ui("M12 5v14M5 12h14");

export const MoreIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);
