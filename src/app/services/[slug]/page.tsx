import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/PageBanner";
import { Engage } from "@/components/Engage";
import { getService, services } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <PageBanner
        kicker={`Practice ${service.num}`}
        title={service.title}
        description={service.summary}
        image={service.image}
        imageAlt={service.imageAlt}
      />
      <section className="service-detail">
        <div className="wrap service-detail-main">
          <figure className="service-detail-hero">
            <Image
              src={service.image}
              alt={service.imageAlt}
              width={1200}
              height={700}
              sizes="(max-width: 900px) 100vw, 900px"
              priority
            />
          </figure>
          <p className="lede service-detail-body">{service.body}</p>
          <ul className="service-detail-list">
            {service.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="service-detail-nav">
            <Link href="/services">← All services</Link>
            <Link href="/appointment">Book Appointment →</Link>
          </div>
        </div>
      </section>
      <Engage
        compact
        image={service.image}
        imageAlt={service.imageAlt}
      />
    </>
  );
}
