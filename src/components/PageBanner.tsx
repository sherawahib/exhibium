import Image from "next/image";
import Link from "next/link";

type Props = {
  kicker: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  crumbLabel?: string;
};

export function PageBanner({
  kicker,
  title,
  description,
  image,
  imageAlt = "",
  crumbLabel,
}: Props) {
  return (
    <header className={`page-banner${image ? " page-banner-media" : ""}`}>
      {image ? (
        <div className="page-banner-visual" aria-hidden={!imageAlt}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="page-banner-img"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className="page-banner-shade" />
          <div className="page-banner-grain" aria-hidden="true" />
        </div>
      ) : (
        <div className="page-banner-fallback" aria-hidden="true" />
      )}

      <div className="wrap page-banner-inner">
        <nav className="page-crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="page-crumb-sep" aria-hidden="true" />
          <span>{crumbLabel ?? title}</span>
        </nav>

        <div className="page-banner-copy">
          <p className="kicker page-banner-kicker">
            <span>{kicker}</span>
          </p>
          <h1>{title}</h1>
          {description ? (
            <p className="page-banner-desc">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="page-banner-edge" aria-hidden="true" />
    </header>
  );
}
