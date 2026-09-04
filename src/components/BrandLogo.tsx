type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className = "h-8 w-8" }: BrandLogoProps) {
  return <img alt="뽀득뽀득 로고" className={`rounded-full object-cover ${className}`} src={`${import.meta.env.BASE_URL}assets/bbodeuk_icon.png`} />;
}
