import Image from "next/image";
import Link from "next/link";

type Props = {
  kicker: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
};

export function PageBanner({
  kicker,
  title,
  description,
  image,
  imageAlt = "",
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
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className="page-banner-shade" />
        </div>
      ) : null}
      <div className="wrap page-banner-inner">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {description ? <p className="page-banner-desc">{description}</p> : null}
        <nav className="page-crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>
      </div>
    </header>
  );
}
