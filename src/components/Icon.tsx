import { svgIconRegistry, type SvgIconName } from "./icons/svgIconRegistry";

type IconProps = {
  name: string;
  className?: string;
  fill?: boolean;
};

export default function Icon({ name, className = "", fill = false }: IconProps) {
  const SvgIcon = svgIconRegistry[name as SvgIconName];
  if (SvgIcon) {
    // `fill` only applies to the Material Symbols branch below (its FILL axis).
    // Registry SVGs ship one weight — control active/inactive via `className` color instead.
    return <SvgIcon aria-hidden="true" className={className} />;
  }

  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${className}`}
      style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
