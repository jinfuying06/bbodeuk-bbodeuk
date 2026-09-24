import { svgIconRegistry, type SvgIconName } from "./icons/svgIconRegistry";

type IconProps = {
  name: string;
  className?: string;
  fill?: boolean;
};

// Legacy Material Symbols font: only SamplePaint and the flagged-off AX screens still use glyph names,
// so the stylesheet loads on first use instead of on every page (was a global <link> in index.html).
const MATERIAL_HREF = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
function loadMaterialSymbols() {
  if (document.querySelector(`link[href="${MATERIAL_HREF}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = MATERIAL_HREF;
  document.head.appendChild(link);
}

export default function Icon({ name, className = "", fill = false }: IconProps) {
  const SvgIcon = svgIconRegistry[name as SvgIconName];
  if (SvgIcon) {
    // `fill` only applies to the Material Symbols branch below (its FILL axis).
    // Registry SVGs ship one weight — control active/inactive via `className` color instead.
    return <SvgIcon aria-hidden="true" className={className} />;
  }

  loadMaterialSymbols();
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
