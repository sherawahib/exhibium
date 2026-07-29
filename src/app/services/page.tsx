import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { Practice } from "@/components/Practice";
import { Engage } from "@/components/Engage";
import { pageImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Over the years Exhibium has focused on a technology-driven advisory service for the A/E/C sectors via its BIM and Modular Groups. Our Market Entry group primarily serves architecture, real estate developers, and retail sectors wishing to expand into the USA, Latin America, and the Middle East.",
};

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        kicker="Service divisions"
        title="Services"
        description="Over the years Exhibium has focused on a technology-driven advisory service for the A/E/C sectors via its BIM and Modular Groups. Our Market Entry group primarily serves the architecture, real estate developers, and retail sectors wishing to expand into the USA, Latin America, and the Middle East."
        image={pageImages.services.src}
        imageAlt={pageImages.services.alt}
      />
      <Practice />
      <Engage compact image="/modular.jpg" />
    </>
  );
}
