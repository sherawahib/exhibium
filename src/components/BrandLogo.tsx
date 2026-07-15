import Image from "next/image";
import Link from "next/link";

type Props = {
  className?: string;
  priority?: boolean;
  /** Use reverse (white mark) wordmark for dark backgrounds */
  onDark?: boolean;
};

export function BrandLogo({
  className = "",
  priority = false,
  onDark = false,
}: Props) {
  return (
    <Link
      href="/"
      className={`brand-logo ${className}`.trim()}
      aria-label="Grupo Exhibium home"
    >
      <Image
        src={onDark ? "/exhibium-logo-reverse.png" : "/exhibium-logo-color.png"}
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
