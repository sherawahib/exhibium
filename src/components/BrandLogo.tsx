import Image from "next/image";
import Link from "next/link";

type Props = {
  className?: string;
  priority?: boolean;
  /** Kept for call-site compatibility; original blue logo is used everywhere */
  onDark?: boolean;
};

export function BrandLogo({ className = "", priority = false }: Props) {
  return (
    <Link
      href="/"
      className={`brand-logo ${className}`.trim()}
      aria-label="Grupo Exhibium home"
    >
      <Image
        src="/exhibium-logo-color.png"
        alt="Grupo Exhibium"
        width={500}
        height={86}
        priority={priority}
        unoptimized
        className="brand-logo-img"
      />
    </Link>
  );
}
