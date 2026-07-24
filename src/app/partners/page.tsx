import type { Metadata } from "next";
import Image from "next/image";
import { PageBanner } from "@/components/PageBanner";
import { Alliances } from "@/components/Alliances";
import { Engage } from "@/components/Engage";
import { pageImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partners and Long Term Client",
  description:
    "Exhibium advisory partners and long-term clients including Alex Partners, Diversified Retail Solutions, La Polar, Al Muhaidib, and Corporación Wong.",
};

export default function PartnersPage() {
  return (
    <>
      <PageBanner
        kicker="Exhibium Advisory partners / long-term clients"
        title="Partners and Long Term Client"
        description="Advisory Partner Relationships and Long Term Client Consultancies from the Exhibium brief—complete engagement details and terms."
        image={pageImages.partners.src}
        imageAlt={pageImages.partners.alt}
      />
      <section className="media-strip">
        <div className="wrap media-strip-grid">
          <figure>
            <Image
              src="/retail.jpg"
              alt="Retail collaboration environment"
              width={800}
              height={520}
              sizes="(max-width: 900px) 100vw, 33vw"
            />
          </figure>
          <figure>
            <Image
              src="/projects.jpg"
              alt="International retail destination"
              width={800}
              height={520}
              sizes="(max-width: 900px) 100vw, 33vw"
            />
          </figure>
          <figure>
            <Image
              src="/modular.jpg"
              alt="Modular development collaboration"
              width={800}
              height={520}
              sizes="(max-width: 900px) 100vw, 33vw"
            />
          </figure>
        </div>
      </section>
      <Alliances />
      <Engage compact image="/retail.jpg" />
    </>
  );
}
